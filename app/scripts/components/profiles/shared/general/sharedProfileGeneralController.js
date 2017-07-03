(function (angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, { controllers: {} });

    App.controllers.sharedProfile = function (
        $scope,
        $log,
        constants,
        SharedProfileService,
        NotifierFactory,
        SharedProfileFactory,
        InstitutionFactory,
        AuthenticationService,
        ModalService,
        WatchService
    ) {
        var controller = this,
            alreadyInitialised = false;
        controller.devMode = constants.dev;
        controller.acceptedFiles = 'image/jpeg, image/pjpeg, image/jpeg, image/pjpeg';
        $scope.generalSubmitDisabled = false;
        $scope.displayRemoveLink = false;
        $scope.uploadEnabled = true;
        $scope.forms = {};
        $scope.profileBeforeChanges = {};
        $scope.foundationYearSpinOptions = {
            verticalbuttons: true,
            min: 0,
            max: new Date().getFullYear()
        };
        $scope.displaySpinner = false;
        SharedProfileFactory.setSelectedTabId(0);

        /**
         * Last uploaded image holder
         *
         * @param {string} smallLogoPath
         * @param {string} mediumLogoPath
         * @param {string} largeLogoPath
         * @returns {{smallLogoPath: string, mediumLogoPath: string, largeLogoPath: string}}
         */
        controller.initLastUploaded = function (smallLogoPath, mediumLogoPath, largeLogoPath) {
            smallLogoPath = (typeof smallLogoPath === 'undefined') ? null : smallLogoPath;
            mediumLogoPath = (typeof mediumLogoPath === 'undefined') ? null : mediumLogoPath;
            largeLogoPath = (typeof largeLogoPath === 'undefined') ? null : largeLogoPath;

            return { 'smallLogoPath': smallLogoPath, 'mediumLogoPath': mediumLogoPath, 'largeLogoPath': largeLogoPath };
        };
        // init lastUploaded variable
        controller.lastUploaded = controller.initLastUploaded();

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
         * Check profile logo data and normalize it.
         */
        controller.checkProfileLogos = function () {
            if (!$scope.profile) {
                $scope.profile = {};
            }
            if (!$scope.profile.smallLogo) {
                $scope.profile.smallLogo = {};
            }
            if (!$scope.profile.mediumLogo) {
                $scope.profile.mediumLogo = {};
            }
            if (!$scope.profile.largeLogo) {
                $scope.profile.largeLogo = {};
            }
        };

        /**
         * Initialize display logo paths.
         */
        controller.assignDefaultDisplayLogos = function () {
            $scope.profile.smallLogoPath = null;
            $scope.profile.mediumLogoPath = null;
            $scope.profile.largeLogoPath = null;
        };

        /**
         * Copy profile logo details to display logo.
         */
        controller.copyProfileToDisplayLogos = function () {
            if (angular.isDefined($scope.profile.smallLogo) && $scope.profile.smallLogo.hasOwnProperty('path')) {
                $scope.profile.smallLogoPath = $scope.profile.smallLogo.path;
            }
            if (angular.isDefined($scope.profile.mediumLogo) && $scope.profile.mediumLogo.hasOwnProperty('path')) {
                $scope.profile.mediumLogoPath = $scope.profile.mediumLogo.path;
            }
            if (angular.isDefined($scope.profile.largeLogo) && $scope.profile.largeLogo.hasOwnProperty('path')) {
                $scope.profile.largeLogoPath = $scope.profile.largeLogo.path;
            }
        };

        /**
         * Copy last uploaded logo paths to profile logo.
         */
        controller.copyLastUploadedToProfileLogos = function () {
            controller.checkProfileLogos();
            if (controller.lastUploaded.smallLogoPath) {
                $scope.profile.smallLogo.path = controller.lastUploaded.smallLogoPath;
            }
            if (controller.lastUploaded.mediumLogoPath) {
                $scope.profile.mediumLogo.path = controller.lastUploaded.mediumLogoPath;
            }
            if (controller.lastUploaded.largeLogoPath) {
                $scope.profile.largeLogo.path = controller.lastUploaded.largeLogoPath;
            }
        };

        /**
         * Copy last uploaded logo paths to profile display logo paths
         */
        controller.copyLastUploadedToProfileDisplayLogos = function () {
            if (controller.lastUploaded.smallLogoPath) {
                $scope.profile.smallLogoPath = controller.lastUploaded.smallLogoPath;
            }
            if (controller.lastUploaded.mediumLogoPath) {
                $scope.profile.mediumLogoPath = controller.lastUploaded.mediumLogoPath;
            }
            if (controller.lastUploaded.largeLogoPath) {
                $scope.profile.largeLogoPath = controller.lastUploaded.largeLogoPath;
            }
        };

        /**
         * Assign display logos on init
         */
        controller.assignDisplayLogos = function () {
            controller.checkProfileLogos();
            controller.assignDefaultDisplayLogos();
            controller.copyProfileToDisplayLogos();
        };

        controller.copyResponseToLastUploaded = function (response) {
            if (response.small.path && response.small.status) {
                controller.lastUploaded.smallLogoPath = response.small.path;
            }
            if (response.medium.path && response.medium.status) {
                controller.lastUploaded.mediumLogoPath = response.medium.path;
            }
            if (response.large.path && response.large.status) {
                controller.lastUploaded.largeLogoPath = response.large.path;
            }
        };

        /**
         * Assign display logos on submit
         */
        controller.assignDisplayLogo = function (clearLogos, response) {
            response = (typeof response === 'undefined') ? false : response;
            controller.checkProfileLogos();
            if (response) {
                controller.copyResponseToLastUploaded(response);
                controller.copyLastUploadedToProfileLogos();
            }
            controller.copyLastUploadedToProfileDisplayLogos();
            if (!clearLogos) {
                controller.lastUploaded = controller.initLastUploaded();
            }
        };

        /**
         * DropZone options url function.
         *
         * @returns {string}
         */
        controller.getUploadUrl = function () {
            return constants.api.institutions.url + '/v1/shared-profile-logo/core-id/' + InstitutionFactory.getCoreId();
        };

        /**
         * Remove profile images from scope.
         */
        $scope.handleClearLogosClick = function () {
            var modalOptions = {
                closeButtonText: 'No',
                actionButtonText: 'Yes',
                headerText: 'Delete Logo',
                bodyText: 'Are you sure you wish to delete profile logos?'
            };
            ModalService.show({}, modalOptions).then(function (result) {
                $scope.handleGeneralSubmit(true);
            });
        };

        /**
         * Actions to do when profile form is submitted.
         *
         * @returns {boolean}
         */
        $scope.handleGeneralSubmit = function (clearLogos) {
            $scope.displaySpinner = true;
            clearLogos = angular.isDefined(clearLogos) ? clearLogos : false;
            if (
                $scope.generalSubmitDisabled ||
                !$scope.forms.generalForm ||
                !$scope.forms.generalForm.$valid
            ) {
                return false;
            }
            $scope.generalSubmitDisabled = true;
            controller.copyLastUploadedToProfileLogos();
            if (clearLogos) {
                $scope.profile.smallLogo.path = null;
                $scope.profile.mediumLogo.path = null;
                $scope.profile.largeLogo.path = null;
            }
            SharedProfileService.saveGeneral($scope.profile).then(function (response) {
                $scope.generalSubmitDisabled = false;
                // if successful update
                if (response.status) {
                    // update profile object
                    controller.assignDisplayLogo(clearLogos, response);
                    if (clearLogos) {
                        $scope.profile.smallLogoPath = null;
                        $scope.profile.mediumLogoPath = null;
                        $scope.profile.largeLogoPath = null;
                        // show status message
                        NotifierFactory.show(
                            'success',
                            'Logos removed successfully!',
                            'Institution Details General data'
                        );
                    } else {
                        // show status message
                        NotifierFactory.show(
                            response.status ? 'success' : 'error',
                            response.status ? 'Saved successfully!' : 'Saving failed!',
                            'Institution Details General data'
                        );
                    }
                    $scope.profileBeforeChanges = angular.copy($scope.profile);
                } else {
                    $scope.profile = angular.copy($scope.profileBeforeChanges);
                }

                if (!clearLogos) {
                    $scope.removeUploaderImage();
                }
                $scope.displaySpinner = false;
            });
        };

        /**
         * Remove dropZone files
         */
        controller.removeDropZoneUploadedImage = function () {
            if (controller.logoDropzoneInstance.files.length > 1) {
                controller.logoDropzoneInstance.removeFile(controller.logoDropzoneInstance.files[0]);
            } else {
                controller.logoDropzoneInstance.removeAllFiles();
            }
        };

        /**
         * Set of actions to remove uploader image
         */
        $scope.removeUploaderImage = function () {
            if (!$scope.generalSubmitDisabled) {
                controller.removeDropZoneUploadedImage();
                controller.handleLogoRemoved();
                controller.lastUploaded = controller.initLastUploaded();
            } else {
                NotifierFactory.show(
                    'info',
                    'Logo upload in progress, please wait.',
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
        controller.handleAccept = function (file, done) {
            file.acceptFile = function () {
                $scope.uploadEnabled = false;
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
        controller.handleLogoUploaded = function (file, response) {
            var success = response &&
                response.hasOwnProperty('large') &&
                response.hasOwnProperty('medium') &&
                response.hasOwnProperty('small');
            if (success) {
                angular.forEach(response, function (data) {
                    if (!data.status) {
                        success = false;
                    }
                });
            }
            if (success) {
                $scope.generalSubmitDisabled = false;
                controller.lastUploaded = controller.initLastUploaded();
                controller.copyResponseToLastUploaded(response);
                // display link below uploader
                $scope.displayRemoveLink = true;
            } else {
                var message = 'Logo image upload failed!';
                if (response !== null && response.hasOwnProperty('code')) {
                    message = response.message;
                }
                controller.removeDropZoneUploadedImage();
                controller.handleLogoRemoved();
                NotifierFactory.show(
                    'error',
                    message,
                    'Institution Details - General'
                );
            }
            $scope.$apply();
        };

        /**
         * Actions to do when file is added to upload queue.
         */
        controller.handleLogoAdded = function (file) {
            file.rejectExtension = function () {
                NotifierFactory.show(
                    'error',
                    'Allowed types: ' + controller.acceptedFiles,
                    'File type is unacceptable.'
                );
                controller.removeDropZoneUploadedImage();
                controller.handleLogoRemoved();
                $scope.$apply();
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
                $scope.$apply();
            }
        };

        /**
         * DropZone handle thumbnail.
         *
         * @param file
         */
        controller.handleThumbnail = function (file) {
            file.rejectDimensions = function (globalAccept) {
                globalAccept = (typeof globalAccept === 'undefined') ? true : globalAccept;
                if (!globalAccept) {
                    NotifierFactory.show(
                        'error',
                        'Logo dimension is incorrect.',
                        'Please upload 200px by 200px logo.'
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
                        'Please upload less than 400 KB.',
                        'Uploaded Image is greater than the limit.'
                    );
                    controller.removeDropZoneUploadedImage();
                    controller.handleLogoRemoved();
                    $scope.$apply();
                }
            };
            // Validate image dimensions
            if (file.height !== 200 || file.width !== 200) {
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
                $scope.$apply();
            }
            if (false === this.isValid) {
                this.isValid = true;
            }
        };

        controller.logoConfig = {
            // http://www.dropzonejs.com/#configuration-options
            dropzone: {
                url: controller.getUploadUrl,
                maxFilesize: 1,
                maxFiles: 1,
                uploadMultiple: 0,
                parallelUploads: 1,
                autoProcessQueue: true,
                addRemoveLinks: false,
                acceptedFiles: controller.acceptedFiles,
                previewsContainer: '.dropzone-previews',
                headers: AuthenticationService.getAuthorizationHeader(),
                thumbnailWidth: 200,
                thumbnailHeight: 200,
                paramName: "file",
                init: controller.handleInit,
                accept: controller.handleAccept
            },
            // http://www.dropzonejs.com/#event-list
            eventHandlers: {
                success: controller.handleLogoUploaded,
                addedfile: controller.handleLogoAdded,
                thumbnail: controller.handleThumbnail
            }
        };

        controller.isRemoveLogosDisabled = function () {
            return !$scope.profile || (
                !$scope.profile.smallLogoPath && !$scope.profile.mediumLogoPath && !$scope.profile.largeLogoPath
            ) || $scope.generalSubmitDisabled;
        };

        controller.initWatches = function () {
            // watch for shared profile changes
            WatchService.create($scope, SharedProfileFactory.getData, function (newValue) {
                $scope.profile = newValue;
                controller.assignDisplayLogos();
                controller.removeDropZoneUploadedImage();
                controller.handleLogoRemoved();
                $scope.profileBeforeChanges = angular.copy(newValue);
            });
        };

        controller.init = function () {
            controller.initWatches();
        };

        // listen to departments tab visibility changes
        WatchService.create($scope, SharedProfileFactory.isGeneralTabSelected, function (isActive) {
            // if not already initialized and tab is active
            if (!alreadyInitialised && isActive) {
                controller.init();
                alreadyInitialised = true;
            }
        });
    };

    angular
        .module('qsHub')
        .controller('SharedProfileGeneralController', [
            '$scope',
            '$log',
            'constants',
            'SharedProfileService',
            'NotifierFactory',
            'SharedProfileFactory',
            'InstitutionFactory',
            'AuthenticationService',
            'ModalService',
            'WatchService',
            App.controllers.sharedProfile
        ]);

} (window.angular));
