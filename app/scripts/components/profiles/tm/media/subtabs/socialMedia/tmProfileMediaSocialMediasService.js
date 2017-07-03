(function (angular) {
    "use strict";

    var App = App || {};
    App = angular.extend({}, App, { services: {} });

    App.services.TmMediaSocialMediasService = function ($resource, $q, $log, constants, TmMediaService, UrlService) {
        var service = {};
        var imageUrl = '/images/media/media-social-media.png';
        var defaultName = '';
        var socialMediaItems = [
            'facebook',
            'youtube',
            'linkedin',
            'twitter',
            'other'
        ];

        service.getSocialMediaModel = function () {
            return $resource(constants.api.institutions.url + '/v1/tm-profile/:id/social-media/:socialMediaId', null, {
                update: { method: 'PATCH' }
            });
        };

        service.getInstitutionModel = function () {
            return $resource(constants.api.institutions.url + '/v1/tm-profile/:id', null, {
                update: { method: 'PATCH' }
            });
        };

        /**
         * Save SocialMedia
         *
         * @param institutionId
         * @param socialMedia
         * @returns {*}
         */
        service.saveSocialMedia = function (institutionId, socialMedia) {
            var socialMediaModel = service.getSocialMediaModel();

            return socialMediaModel.update({ id: institutionId, socialMediaId: service.getType() },
                socialMedia
            ).$promise.then(function (data) {
                if (constants.dev) {
                    $log.log('success, got data: ', data);
                }
                return true;
            }, function (error) {
                //@todo log error
                if (constants.dev) {
                    $log.log('request failed' + error);
                }
                return false;
            });
        };

        /**
         * Set selected socialMedia.
         *
         * @param {Object} item
         */
        service.setSelectedSocialMedia = function (item) {
            service.selectedSocialMedia = item;
        };

        /**
         * Get selected socialMedia
         *
         * @returns {Object}
         */
        service.getSelectedSocialMedia = function () {
            return service.selectedSocialMedia;
        };

        /**
         * Trigger change.
         *
         * @param triggerChange
         */
        service.setTriggerChange = function (triggerChange) {
            service.triggerChange = triggerChange;
        };

        /**
         * Get trigger change value
         *
         * @returns {boolean}
         */
        service.getTriggerChange = function () {
            return service.triggerChange;
        };

        /**
         * Get socialMedia items.
         *
         * @returns {Object}
         */
        service.getSocialMediaItems = function () {
            return service.socialMediaItems;
        };

        service.setSocialMediaItems = function (items) {
            service.socialMediaItems = items;
        };

        /**
         * Get socialMedia item.
         */
        service.getItemSocialMedia = function () {
            return {
                'id': '',
                'name': defaultName,
                'description': '',
                'master': true,
                'url': '',
                'imageUrl': imageUrl
            };
        };

        /**
         * get selected social media url.
         *
         * @param {String} type
         * @returns {String}
         */
        service.getSelectedSocialMediaUrl = function (type) {
            switch (type) {
                case 'facebook':
                    return 'https://www.facebook.com/universityrankings';
                case 'youtube':
                    return 'https://www.youtube.com/topuniversities';
                case 'linkedin':
                    return 'https://www.linkedin.com/company/qs';
                case 'twitter':
                    return 'https://twitter.com/worlduniranking';
                default:
                    return 'http://www.yourwebsite.com';
            }
        };

        /**
         * Reset socialMedia item.
         *
         * @returns {Object}
         * @param item
         */
        service.resetItem = function (item) {
            item.master = true;
            item.url = '';
            item.name = defaultName;
            item.imageUrl = imageUrl;

            return item;
        };

        /**
         * Format socialMedias.
         *
         * @param socialMedias
         * @returns {Object}
         */
        service.formatSocialMedias = function (socialMedias) {
            angular.forEach(socialMedias, function (value, key) {
                socialMedias[key] = service.formatSocialMedia(value);
            });

            return socialMedias;
        };

        /**
         * Validate Social Media data
         *
         * @param {Object} socialMediaItem
         * @returns {Object}
         */
        service.socialMediaValidation = function (socialMediaItem) {
            var invalidItems = [];
            angular.forEach(socialMediaItem, function (item, key) {
                if ((item.url !== "") && !(item.master)) {
                    socialMediaItem[key].url = "";
                } else if ((item.url !== "") && !(item.master)) {
                    invalidItems.push({
                        invalid: true,
                        index: key
                    });
                } else if (((item.url === "") || (item.url === undefined)) && (item.master)) {
                    invalidItems.push({
                        invalidUrl: true,
                        index: key
                    });
                }
                else if (!(item.url.match(UrlService.getPattern())) && (item.master || item.pg || item.ug)){
                    invalidItems.push({
                        invalidUrl: true,
                        index: key
                    });
                }

            });
            if (invalidItems.length > 0) {
                return invalidItems;
            }
        };

        service.socialMediaFormValidation = function (socialMediaItem) {
            var invalidItems = [];
            if (angular.isDefined(socialMediaItem)) {
                angular.forEach(socialMediaItem.$error.url, function (error) {
                    var key = error.$name.charAt(error.$name.length - 1);
                    invalidItems.push({
                        invalidUrl: true,
                        index: key
                    });
                });
            }

            return invalidItems;
        };

        /**
         * Format to match db data.
         *
         * @param {Object} socialMediaItem
         * @returns {Object}
         */
        service.formatSocialMedia = function (socialMediaItem) {
            var output = [];

            angular.forEach(socialMediaItem, function (item, key) {
                if ((item.master) && item.url !== "") { // item is set to profile, we'll save it
                    var tmpOutput = {};
                    tmpOutput.url = item.url;
                    tmpOutput.assignedTo = [];
                    if (item.master) {
                        tmpOutput.assignedTo.push('master');
                    }
                    output.push(tmpOutput);
                }
            });
            return output;
        };

        service.setChanges = function (changes) {
            service.changes = changes;
        };

        service.getChanges = function () {
            return service.changes;
        };

        /**
         * Sets has errors flag.
         *
         * @param {boolean} hasErrors
         */
        service.setHasErrors = function (hasErrors) {
            service.hasErrors = hasErrors;
        };

        /**
         * Gets has errors flag.
         *
         * @returns {boolean|*}
         */
        service.getHasErrors = function () {
            return service.hasErrors;
        };

        /**
         * Sets is highlighted.
         *
         * @param {boolean} isHighlighted
         */
        service.setHighlighted = function (isHighlighted) {
            service.isHighlighted = isHighlighted;
        };

        /**
         * Gets is Highlighted.
         *
         * @returns {boolean|*}
         */
        service.getHighlighted = function () {
            return service.isHighlighted;
        };

        service.coreId = function (coreId) {
            service.coreId = coreId;
        };

        /**
         * Set type.
         *
         * @returns {*}
         */
        service.setType = function (type) {
            service.type = type;
        };

        /**
         * Get type.
         *
         * @returns {*}
         */
        service.getType = function () {
            return service.type;
        };

        service.socialMediaItems = function () {
            return socialMediaItems;
        };

        service.getSocialMediaObject = function () {
            var socialMedia = {};
            angular.forEach(socialMediaItems, function (mediaType) {
                socialMedia[mediaType] = {};
                angular.forEach(TmMediaService.getTypes(), function (profileType) {
                    socialMedia[mediaType][profileType] = false;
                });
            });

            return socialMedia;
        };

        service.assignData = function (inputData, socialMedia) {
            angular.forEach(inputData, function (mediaType, mediaTypeValue) {
                angular.forEach(mediaType, function () {
                    socialMedia[mediaTypeValue][TmMediaService.typeOverview()] = true;
                });
            });

            return socialMedia;
        };

        service.processInput = function (inputData) {
            var socialMedia = service.getSocialMediaObject();
            socialMedia = service.assignData(inputData, socialMedia);

            return socialMedia;
        };

        /**
         * Flattens inputData for left column
         *
         * @param {Object} inputData
         * @param {boolean} forType
         * @returns {*}
         */
        service.flattenArray = function (inputData, forType) {
            if (angular.isUndefined(forType)) {
                forType = false;
            }
            var typeMaster = TmMediaService.typeOverview();

            if (forType) {
                var outputData = {};

                angular.forEach(inputData, function (inputDataValue, inputDataKey) {
                    if (angular.isDefined(inputDataValue.assignedTo)) {
                        angular.forEach(inputData[inputDataKey].assignedTo, function (assignedType) {
                            if (assignedType === typeMaster) {
                                outputData[typeMaster] = true;
                            }
                        });
                    }
                });

                inputData = outputData;
            } else {
                angular.forEach(socialMediaItems, function (mediaType) {
                    if (angular.isDefined(inputData) && angular.isDefined(inputData[mediaType])) {
                        angular.forEach(inputData[mediaType], function (objectData, dataKey) {
                            inputData[mediaType][dataKey][typeMaster] = true;
                            inputData[mediaType][dataKey].display = true;
                            if (angular.isDefined(inputData[mediaType][dataKey].assignedTo)) {
                                angular.forEach(inputData[mediaType][dataKey].assignedTo, function (assignedType) {
                                    if (assignedType === typeMaster) {
                                        inputData[mediaType][dataKey][typeMaster] = true;
                                    }
                                });
                                delete (inputData[mediaType][dataKey].assignedTo);
                            }
                        });
                        if (inputData[mediaType].length === 0) {
                            inputData[mediaType] = [];
                            inputData[mediaType].push(service.getEmpty(true, true));
                        }
                    } else {
                        if (angular.isUndefined(inputData) || angular.isArray(inputData)) {
                            inputData = {};
                        }
                        inputData[mediaType] = [];
                        inputData[mediaType].push(service.getEmpty(true, true));
                    }
                });
            }

            return inputData;
        };

        /**
         *
         * @param {boolean} initialValue
         * @param {boolean} displayValue
         * @returns {{url: string, display: boolean, master: boolean, ug: boolean, pg: boolean}}
         */
        service.getEmpty = function (initialValue, displayValue) {
            return {
                'url': '',
                'display': displayValue,
                'master': initialValue
            };
        };

        service.resetDataForType = function (data, type) {
            angular.forEach(data, function (dataValue, dataKey) {
                if (dataKey === type) {
                    angular.forEach(data[dataKey], function (dataSubValue, dataSubKey) {
                        data[dataKey][dataSubKey].master = false;
                        data[dataKey][dataSubKey].url = '';
                    });
                }
            });

            return data;
        };

        service.assignNewData = function (values, type, currentlySelected) {
            var outputValues = angular.copy(values);
            angular.forEach(values, function (objectData, valueKey) {
                if (angular.isDefined(objectData.assignedTo)) {
                    outputValues[valueKey][TmMediaService.typeOverview()] = false;
                    outputValues[valueKey][TmMediaService.typeUndergraduate()] = false;
                    outputValues[valueKey][TmMediaService.typePostgraduate()] = false;
                    angular.forEach(objectData.assignedTo, function (assignedType) {
                        outputValues[valueKey][assignedType] = true;
                    });
                    delete (outputValues[valueKey].assignedTo);
                }
            });
            var copySelected = angular.copy(currentlySelected);
            angular.forEach(copySelected, function (mediaType, mediaTypeKey) {
                if (mediaTypeKey === type) {
                    copySelected[mediaTypeKey] = outputValues;
                }
            });

            return copySelected;
        };

        service.applyUpdate = function (type, values) {
            var currentlySelected = service.getSelectedSocialMedia();

            return service.assignNewData(values, type, currentlySelected);
        };

        return service;
    };

    angular
        .module('qsHub')
        .service('TmMediaSocialMediasService', [
            '$resource',
            '$q',
            '$log',
            'constants',
            'TmMediaService',
            'UrlService',
            App.services.TmMediaSocialMediasService
        ]);

} (window.angular));
