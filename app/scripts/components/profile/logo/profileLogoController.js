/* global logoType */

(function(angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, {controllers:{}});

    App.controllers.profileLogo = function (
        $scope,
        constants,
        ProfileLogoService,
        UserFactory,
        NotifierFactory,
        AuthenticationService,
        $timeout
    ) {
        var controller = this;
        controller.devMode = constants.dev;
        $scope.forms = {};
        $scope.gravatar = false;
        $scope.user = UserFactory.getData();

        if (angular.isDefined($scope.user) &&
            $scope.user !== null &&
            !$scope.user.profileLogo
        ) {
            $scope.gravatar = true;
            $scope.user.profileLogo = '';
        }

        $scope.uploadEnabled = true;
        controller.acceptedFiles = 'image/jpeg, image/pjpeg';
        // enable update button
        $scope.generalSubmitDisabled = false;
        $scope.displayRemoveLink = false;
        $scope.profilePic = null;

        /**
         * Actions to do when image is removed.
         */
        $scope.handleRemoveLogoClick = function () {
            $scope.profile[logoType].path = null;
        };

        /**
         * Actions to do when update request is finished.
         *
         * @param {boolean} success
         */
        controller.updateDetailsCallback = function (success) {
            $scope.updateDetailsInProgress = false;
            NotifierFactory.show(
                success ? 'success' : 'error',
                success ? 'Updated successfully!' : 'Update failed!',
                'User Details'
            );
            if (success) {
                UserFactory.announceNameChanges($scope.user);
            }
        };

        /**
         * Modify scope variable on logo remove.
         */
        controller.handleLogoRemoved = function () {
            // show upload area
            $scope.uploadEnabled = true;
            // enable update button
            $scope.generalSubmitDisabled = false;
            // hide remove link below uploader
            $scope.displayRemoveLink = false;
        };

        /**
         * Actions to do when profile form is submitted.
         *
         * @returns {boolean}
         */
        $scope.handleGeneralSubmit = function () {
            $scope.displaySpinner = true;
            if (
                //$scope.generalSubmitDisabled ||
                !$scope.forms.imageForm ||
                !$scope.forms.imageForm.$valid
            ) {
                return false;
            }
            $scope.generalSubmitDisabled = true;
            ProfileLogoService.updateProfilePicture($scope.profilePic).then(function (response) {
                NotifierFactory.show(
                    response.status ? 'success' : 'error',
                    response.status ? 'Saved successfully!' : 'Saving failed!',
                    'User Profile image'
                );
                $scope.displaySpinner = false;
                if (response.status) {
                    $scope.user.profileLogo = response.url;
                    $scope.gravatar = false;
                    UserFactory.setProfileLogo($scope.user.profileLogo);
                } else {
                    if ($scope.user.profileLogo === '' ||
                        !$scope.user.profileLogo ||
                        $scope.user.profileLogo === undefined
                    ) {
                        $scope.user.profileLogo = '';
                        $scope.gravatar = true;
                    }
                }
                $scope.generalSubmitDisabled = false;
                $scope.removeUploaderImage();
            });
        };

        /**
         * Remove dropZone files
         */
        controller.removeDropZoneUploadedImage = function () {
            if (controller.dropZoneImageInstance &&
                controller.dropZoneImageInstance.file &&
                (controller.dropZoneImageInstance.file.length > 1)) {
                controller.dropZoneImageInstance.removeFile(controller.dropZoneImageInstance.files[0]);
            } else {
                $scope.gravatar = false;
                controller.dropZoneImageInstance.removeAllFiles();
                $scope.displayRemoveLink = false;
            }
        };

        /**
         * Set of actions to remove uploader image
         */
        $scope.removeUploaderImage = function () {
            if (!$scope.generalSubmitDisabled) {
                $timeout(function() {
                    controller.removeDropZoneUploadedImage();
                    controller.handleLogoRemoved();
                });
            } else {
                NotifierFactory.show(
                    'info',
                    'Image upload in progress, please wait.',
                    ''
                );
            }
        };

        /**
         * DropZone init.
         */
        controller.handleInit = function () {
            this.isValid = true;
            this.globalAccept = false;
            this.localAccept = false;
        };

        /**
         * DropZone handle accept.
         *
         * @param file
         * @param done
         */
        controller.handleAccept = function(file, done) {
            file.acceptFile = function () {
                $scope.uploadEnabled = false;
                $scope.displayRemoveLink = !$scope.displayRemoveLink;
                $scope.$apply();
                done();
            };
        };

        /**
         * Actions to do when file is uploaded to server.
         *
         * @param {Object} file - instance of dropzone file
         * @param {Object} response - server response object
         */
        controller.handleImageUploaded = function(file, response) {
            $scope.$apply(function() {
                $scope.generalSubmitDisabled = false;
                $scope.profilePic = response.path;
                // display link below uploader
                $scope.displayRemoveLink = true;
            });
        };

        /**
         * Actions to do when file uploaded fails.
         */
        controller.handleImageUploadError = function(error) {
            var errorMessage = error.xhr !== undefined ? JSON.parse(error.xhr.responseText) : false;
            errorMessage = errorMessage ? errorMessage.message : 'Image upload failed!';
            if (this.files.length > 0) {
                this.removeFile(this.files[0]);
            }
            $scope.$apply(function() {
                $scope.displayRemoveLink = false;
                $scope.generalSubmitDisabled = false;
                NotifierFactory.show(
                    'error',
                    errorMessage,
                    'Profile image'
                );
            });
        };

        /**
         * Actions to do when file is added to upload queue.
         */
        controller.handleImageAdded = function (file) {
            $scope.displayRemoveLink = true;
            file.rejectExtension = function () {
                NotifierFactory.show(
                    'error',
                    'Allowed types: ' + controller.acceptedFiles,
                    'File type is unacceptable.'
                );
                controller.removeDropZoneUploadedImage();
                controller.handleLogoRemoved();
            };
            if (this.files.length === 1) {
                this.globalAccept = false;
                this.localAccept = false;
            }
            if (!this.globalAccept && !this.localAccept && this.files.length === 1) {
                this.isValid = true;
                this.localAccept = true;
            }
            if (this.files.length > 1 && this.globalAccept) {
                this.isValid = false;
                this.globalAccept = true;
                this.removeFile(this.files[1]);
                $scope.$apply();
            }
            this.isValid = true;
            // Validate image extension for drag and drop
            var allowedExtensionsArray = controller.acceptedFiles.split(',');
            if (allowedExtensionsArray.indexOf(file.type) === -1) {
                this.isValid = false;
                file.rejectExtension();
            }
            if (this.isValid) {
                // disable update button
                $scope.generalSubmitDisabled = true;
                // hide upload area
                $scope.uploadEnabled = false;
            }
        };

        /**
         * DropZone handle thumbnail.
         *
         * @param file
         */
        controller.handleThumbnail = function(file) {
            file.rejectDimensions = function (globalAccept) {
                globalAccept = (typeof globalAccept === 'undefined') ? true : globalAccept;
                if (!globalAccept) {
                    NotifierFactory.show(
                        'error',
                        'Image dimension is incorrect.',
                        'Please upload 100px by 100px image.'
                    );
                    controller.removeDropZoneUploadedImage();
                    controller.handleLogoRemoved();
                    $scope.$apply();
                }
            };
            file.rejectSize = function (globalAccept) {
                globalAccept = (typeof globalAccept === 'undefined') ? true : globalAccept;
                if (!globalAccept) {
                    NotifierFactory.show(
                        'error',
                        'File size has exceeded the 1 MB limit.',
                        'Please upload again'
                    );
                    $scope.$apply();
                }
            };
            // Validate image dimensions
            if (file.height < 100 || file.width < 100) {
                this.isValid = false;
                file.rejectDimensions(this.globalAccept);
            }
            // Validate image size
            if (file.size > 400000) {
                this.isValid = false;
                file.rejectSize(this.globalAccept);
            }
            if (this.isValid && !this.globalAccept && this.localAccept) {
                this.globalAccept = true;
                file.acceptFile(this.localAccept);
            } else {
                $scope.generalSubmitDisabled = false;
                if (this.files.length > 1 && this.globalAccept) {
                    this.removeFile(this.files[1]);
                }
            }
            if (false === this.isValid) {
                this.isValid = true;
            }

        };

        controller.imageConfig = {
            // http://www.dropzonejs.com/#configuration-options
            dropzone: {
                url: ProfileLogoService.getUrl(),
                maxFilesize: 0.4,
                maxFiles: 1,
                uploadMultiple: 0,
                parallelUploads: 1,
                autoProcessQueue: true,
                addRemoveLinks: false,
                acceptedFiles: controller.acceptedFiles,
                previewsContainer: '.dropzone-previews',
                headers: AuthenticationService.getAuthorizationHeader(),
                thumbnailWidth: 100,
                thumbnailHeight: 100,
                clickable: '.upload-button',
                paramName: "file",
                init: controller.handleInit,
                accept: controller.handleAccept
            },
            // http://www.dropzonejs.com/#event-list
            eventHandlers: {
                success: controller.handleImageUploaded,
                addedfile: controller.handleImageAdded,
                thumbnail: controller.handleThumbnail,
                error: controller.handleImageUploadError
            }
        };

        controller.initWatches = function () {
            // watch for Username changes changes at profile page
            $scope.$watch(UserFactory.getData, function (data) {
                if (data) {
                    $scope.user = data;
                }
            });
        };

        controller.init = function () {
            controller.initWatches();
        };

        controller.init();
    };

    angular
        .module('qsHub')
        .controller('ProfileLogoController', [
            '$scope',
            'constants',
            'ProfileLogoService',
            'UserFactory',
            'NotifierFactory',
            'AuthenticationService',
            '$timeout',
            App.controllers.profileLogo
        ]);

}(window.angular));
