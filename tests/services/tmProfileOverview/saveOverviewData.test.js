(function () {
    'use strict';
    describe('TmProfileOverviewService service', function () {

        beforeEach(module('qsHub'));

        var service, $rootScope, $scope;

        if (typeof uiMode === 'undefined' || !uiMode) {
            beforeEach(module('templates'));
        }

        beforeEach(inject(function (_TmProfileOverviewService_, _$rootScope_) {
            service = _TmProfileOverviewService_;
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
        }));

        afterEach(function () {
            service = null;
        });


        it('should exist', function () {
            expect(service).toBeDefined();
        });

        it('should exist', function () {
            expect(service.saveOverviewData).toBeDefined();
        });

        describe('when recieve a successful response', function () {
            it('should not throw an expectation', function () {
                var callback = function () {
                    var json = {
                        advanced: true,
                        advancedMasterOverview: '<p><a href="http://www.hult.edu/">Hult International Business School</a> is a new kind of business school for the global generation.&nbsp;&nbsp;Hult offers a range of practical, business-focused programs including the <a href="http://www.hult.edu/en/mba/">Global One-Year MBA</a>, <a href="http://www.hult.edu/en/mba/executive-mba/">Global Executive MBA</a>, <a href="http://www.hult.edu/en/masters-degree/">Master</a>, and <a href="http://www.hult.edu/en/undergraduate/bachelor-of-business-administration/">Bachelor</a> degrees.&nbsp;&nbsp;Hult has campuses in the world’s most influential cities, including Boston, San Francisco, London, Dubai, New York, and Shanghai. Graduate with a global network in place by studying alongside students from over 130 nationalities, and networking with leading employers from around the world.&nbsp;</p>',
                        masterRequestInfoEmail: 'info.europe@hult.edu',
                        masterRequestInfoUrlTitle: null,
                        masterWebsiteUrl: 'http://hult.edu',
                        requestInfoTypeMaster: 'email',
                        type: 'master'
                    },
                        id = '5874ac4685957b19fc604238';
                    service.saveOverviewData(id, json);
                }
                expect(callback).not.toThrow();
            });
        });

        describe('when recieve a error message', function () {
            it('should not throw an expectation', function () {
                var callback = function () {
                    var json = {
                        code: '400',
                        message: 'Could not recieve data from the API'
                    },
                        id = '5874ac4685957b19fc604238';
                    service.saveOverviewData(id, json);
                }
                expect(callback).not.toThrow();
            });
        });

        describe('when receiving a null response', function () {
            it('should not throw an exception', function () {
                var callback = function () {
                    service.saveOverviewData(null);
                }
                expect(callback).not.toThrow();
            });
        });

        describe('when recieve a successful response', function () {
            it('should return true', function () {
                var callback = function () {
                    var json = {
                        advanced: true,
                        advancedMasterOverview: '<p><a href="http://www.hult.edu/">Hult International Business School</a> is a new kind of business school for the global generation.&nbsp;&nbsp;Hult offers a range of practical, business-focused programs including the <a href="http://www.hult.edu/en/mba/">Global One-Year MBA</a>, <a href="http://www.hult.edu/en/mba/executive-mba/">Global Executive MBA</a>, <a href="http://www.hult.edu/en/masters-degree/">Master</a>, and <a href="http://www.hult.edu/en/undergraduate/bachelor-of-business-administration/">Bachelor</a> degrees.&nbsp;&nbsp;Hult has campuses in the world’s most influential cities, including Boston, San Francisco, London, Dubai, New York, and Shanghai. Graduate with a global network in place by studying alongside students from over 130 nationalities, and networking with leading employers from around the world.&nbsp;</p>',
                        masterRequestInfoEmail: 'info.europe@hult.edu',
                        masterRequestInfoUrlTitle: null,
                        masterWebsiteUrl: 'http://hult.edu',
                        requestInfoTypeMaster: 'email',
                        type: 'master'
                    },
                        id = '5874ac4685957b19fc604238';
                    service.saveOverviewData(id, json);
                }
                expect(callback).toBeTruthy();
            });
        })

    });
} ());
