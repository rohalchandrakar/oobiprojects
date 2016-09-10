(function ($,document) {
    var id = '';
    var currentMenu = 'builder';
    var currentMenuEl = '';
    var builderName = '';
    var projectName = '';
    var unitName = '';
    var el = document.documentElement;
    var containerWidth = $('#container').width();
    var containerHeight = $('#slideOut').height() + 10;
    var _drawModel = new DrawModel('container', 'model/unitplan/', 'Unitplan_online_portal', containerWidth, containerHeight);
    var _currProjectID = undefined, prevPanoramaImagePath = undefined;
    
    var app = {
        data: {},
        selected: {"builder": {}, "project": {}, "unitPlan": {}},
        init: function () {
            this.data = this.getMenuData();
            this.bindEvents();
            this.showMenu();
        },
        bindEvents: function () {
            var self = this;
            $('.collapsible').on('click', '.collection-item', function (e) {
                // use 'self' here to refer app object
                var collectionItems = $('.collection-item');
                currentMenuEl = $(this);
                id = $(this).data('id');
                currentMenu = $(this).data('sub_menu');
                self.data = self.getMenuData();
                self.showSelections();
                if (currentMenu !== '') {
                    self.showMenu();
                }
                
                if(id.indexOf('unit_') != -1) {
                    self.loadModel(id);
                    if(("model/" + _currProjectID.toString() + "/skybox_unit/texture.jpg") !== prevPanoramaImagePath)
                    {
                        _drawModel.changePanorama("model/" + _currProjectID.toString() + "/skybox_unit/texture.jpg");
                        prevPanoramaImagePath = "model/" + _currProjectID.toString() + "/skybox_unit/texture.jpg";
                    }
                    collectionItems.removeClass('active');
                    currentMenuEl.addClass('active');
                }
                if(id.indexOf('project_') != -1) {
                    self.loadModel(id);
                    _drawModel.changePanorama("model/skybox_default/texture.jpg");
                    _currProjectID = id;
                }
                if(id.indexOf('builder_') != -1) {
                    _drawModel.changePanorama("model/skybox_default/texture.jpg");
                }

            });

            $('.selections').on('click', '#removeBuilder', function (e) {
                _drawModel.clearViewport();
                _drawModel.changePanorama("model/skybox_default/texture.jpg");
                currentMenuEl = ''; // reset to prevent setting selection
                id = $(this).data('id');
                currentMenu = $(this).data('sub_menu');
                self.data = self.getMenuData();
                self.showMenu();
                self.selected.builder = {};
                self.selected.project = {};
                self.selected.unitPlan = {};
                $('#builderName').html('');
                $('#projectName').html('');
                $('#unitName').html('');
                $('#builderName').addClass('invisible');
                $('#projectName').addClass('invisible');
                $('#unitName').addClass('invisible');
            });
            $('.selections').on('click', '#removeProject', function (e) {
                _drawModel.clearViewport();
                _drawModel.changePanorama("model/skybox_default/texture.jpg");
                currentMenuEl = ''; // reset to prevent setting selection
                id = $(this).data('id');
                currentMenu = $(this).data('sub_menu');
                self.data = self.getMenuData();
                self.showMenu();
                self.selected.project = {};
                self.selected.unitPlan = {};
                $('#projectName').html('');
                $('#unitName').html('');
                $('#projectName').addClass('invisible');
                $('#unitName').addClass('invisible');
            });
            $('.selections').on('click', '#removeUnitPlan', function (e) {
                currentMenuEl = ''; // reset to prevent setting selection
                id = $(this).data('id');
                currentMenu = $(this).data('sub_menu');
                self.data = self.getMenuData();
                self.showMenu();
                self.selected.unitPlan = {};
                $('#unitName').html('');
                $('#unitName').addClass('invisible');
            });
            $('body').on('click','.btn-fullscreen',function(e){
                $(this).addClass('hide');
                $('main').css('padding-left','0px');
                
                $('.btn-fullscreen-exit').removeClass('hide');
                $('.side-nav').css('transform', 'translateX(-100%)');
                
                var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen ; 
                 rfs.call(el);
            });
            $('body').on('click','.btn-fullscreen-exit',function(e){
                $(this).addClass('hide');
                $('main').css('padding-left','240px');
                
                $('.btn-fullscreen').removeClass('hide');
                $('.side-nav').css('transform', 'translateX(0px)');
                
                document.exitFs = document.webkitCancelFullScreen || document.mozCancelFullScreen;
                document.exitFs();
            });

            $('body').on('click','.btn-1st-person',function(e){
                if(_drawModel.getCamEnabled())
                {
                    _drawModel.swithToOrbit();
                }
                else
                {
                    _drawModel.swithToFPS(); 
                }  
                console.log("switch to FPS mode");
            });

            $('body').on('click','.btn-2d-plan',function(e){
                // hide/unhide floorplan dimensions plane
                _drawModel.toggel2dPlanVisibility();
            });

            $(document)
                .on('pointerlockchange', function(){
                    self.pointerLockToggle(self);
                })
                .on('mozpointerlockchange', function(){
                    self.pointerLockToggle(self);
                })
                .on('webkitpointerlockchange', function(){
                    self.pointerLockToggle(self);
                });

            $(window).bind("resize", function(){
                self.resizeCanvas();
            });
        },
        pointerLockToggle: function(self) {
            var element = document.getElementById('container');
            if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {
                $('main').css('padding-left','0px');
                $('.side-nav').css('transform', 'translateX(-100%)');
            } else {
                $('main').css('padding-left','240px');
                $('.side-nav').css('transform', 'translateX(0px)');
            }
            self.resizeCanvas();
        },
        loadModel: function(id) {
            console.log('unit plan id',id);
            //_drawModel = undefined;
            //draw model
            _drawModel.updateModel('model/' + id + '/', 'model');
            
        },
        resizeCanvas: function() {
          var containerWidth = $('#container').width();
          var containerHeight = screen.height;
          console.log(containerWidth)
                $('#container canvas').css('width',containerWidth);  
                 $('#container canvas').css('height',containerHeight);
                 _drawModel.reSizeContainer();
        },

        showMenu: function () {
            this.clearMenu();

            var html = this.menuTemplate(this.data);

            $('.collapsible').html(html);
            $('.collapsible').collapsible();
        },
        showSelections: function () {
            this.showSelectedBuilderName();
            this.showSelectedProjectName();
//            this.showSelectedUnitName();
        },
        showSelectedBuilderName: function () {
            if (typeof this.selected.builder.name !== 'undefined' && this.selected.builder.name !== '') {
                $('#builderName').html(this.selected.builder.name + '<i data-sub_menu="builder" data-id="' + id + '" id="removeBuilder" class="material-icons right">close</i>');
                $('#builderName').removeClass('invisible');
            }
        },
        showSelectedProjectName: function () {
            if (typeof this.selected.project.name !== 'undefined' && this.selected.project.name !== '') {
                $('#projectName').html(this.selected.project.name + '<i data-sub_menu="project" data-id="' + this.selected.builder.id + '" id="removeProject" class="material-icons right">close</i>');
                $('#projectName').removeClass('invisible');
            }
        },
        showSelectedUnitName: function () {
            if (typeof this.selected.unitPlan.name !== 'undefined' && this.selected.unitPlan.name !== '') {
                $('#unitName').html(this.selected.unitPlan.name + '<i data-sub_menu="project" data-id="' + this.selected.builder.id + '" id="removeUnitPlan" class="material-icons right">close</i>');
                $('#unitName').removeClass('invisible');
            }
        },
        getMenuData: function () {
            var _data = {};

            switch (currentMenu) {
                case 'builder':
                    _data = this.getBuilderObj();
                    break;
                case 'project':
                    this.selected.builder.id = id;
                    _data = this.getBuilderProjectObj(id);
                    if (currentMenuEl !== '') {
                        builderName = currentMenuEl.html();
                        console.log(builderName);
                        this.selected.builder.name = builderName;
                    }
                    break;
                case 'unit_plan':
                    this.selected.project.id = id;
                    _data = this.getProjectUnitPlanObj(id);
                    if (currentMenuEl !== '') {
                        projectName = currentMenuEl.html();
                        this.selected.project.name = projectName;
                    }
                    break;
                default:
                    this.selected.unitPlan.id = id;
                    if (currentMenuEl !== '') {
                        unitName = currentMenuEl.html();
                        this.selected.unitPlan.name = unitName;
                    }
                    break;
            }
            return _data;
        },
        getBuilders: function () {
            return data.builders.items;
        },
        getBuilderObj: function () {
            var builder = {};
            builder.name = data.builders.menuName;
            builder.subMenu = data.builders.subMenu;
            builder.items = data.builders.items;
            return builder;
        },
        getBuilder: function (id) {
            var builder;
            var buildersLength = data.builders.items.length;
            for (var i = 0; i < buildersLength; i++) {
                builder = data.builders.items[i];
                if (builder.id == id) {
                    return builder;
                }
            }
            return false;
        },
        getBuilderProjects: function (id) {
            var project;
            var projects = [];
            var projectsLength = data.projects.items.length;
            for (var i = 0; i < projectsLength; i++) {
                project = data.projects.items[i];
                if (project.builderId == id) {
                    projects.push(project);
                }
            }

            if (projects.length === 0) {
                return false;
            }

            return projects;
        },
        getBuilderProjectObj: function (id) {
            var project;
            var projects = {};
            projects.name = data.projects.menuName;
            projects.subMenu = data.projects.subMenu;
            projects.items = [];
            var projectsLength = data.projects.items.length;
            for (var i = 0; i < projectsLength; i++) {
                project = data.projects.items[i];
                if (project.builderId == id) {
                    projects.items.push(project);
                }
            }

            if (projects.items.length === 0) {
                return false;
            }

            return projects;
        },
        getProjectUnitPlans: function (id) {
            var unitPlan;
            var unitPlans = [];
            var unitPlansLength = data.unitPlans.items.length;
            for (var i = 0; i < unitPlansLength; i++) {
                unitPlan = data.unitPlans.items[i];
                if (unitPlan.projectId == id) {
                    unitPlans.push(unitPlan);
                }
            }

            if (unitPlans.length === 0) {
                return false;
            }

            return unitPlans;
        },
        getProjectUnitPlanObj: function (id) {
            var unitPlan;
            var unitPlans = {};
            unitPlans.name = data.unitPlans.menuName;
            unitPlans.subMenu = data.unitPlans.subMenu;
            unitPlans.items = [];

            var unitPlansLength = data.unitPlans.items.length;
            for (var i = 0; i < unitPlansLength; i++) {
                unitPlan = data.unitPlans.items[i];
                if (unitPlan.projectId == id) {
                    unitPlans.items.push(unitPlan);
                }
            }

            if (unitPlans.items.length === 0) {
                return false;
            }

            return unitPlans;
        },
        clearMenu: function () {
            $('.collapsible').html('');
        },
        menuTemplate: function (_data) {
            var menuName = _data.name;
            var html = '<li>';
            html += '<div class="collapsible-header no-pad-rit cyan accent-4 white-text active">';
            html += menuName;
            html += '<i class="material-icons right">keyboard_arrow_right</i>';
            html += '</div>';
            html += this.menuItemsTemplate(_data);
            html += '</li>';
            return html;
        },
        menuItemsTemplate: function (_data) {
            var item;
            var itemsLength = _data.items.length;
            var html = '';

            html += '<div class="collapsible-body">';
            html += '<ul class="collection">';
            for (var i = 0; i < itemsLength; i++) {
                item = _data.items[i];

                if (typeof item.image !== 'undefined' && item.image !== '') {
                    html += '<li data-sub_menu="' + _data.subMenu + '" data-id="' + item.id + '" class="collection-item avatar valign-wrapper">';
                    html += '<img src="' + item.image + '" alt="" class="circle">';
                    html += '<span class="truncate valign">';
                } else {
                    html += '<li data-sub_menu="' + _data.subMenu + '" data-id="' + item.id + '" class="collection-item">';
                    html += '<span>';
                }

                html += item.name;
                html += '</span>';
                html += '</li>';
            }
            html += '</ul>';
            html += '</div>';

            return html;
        }
    }

    app.init();
})(jQuery,document);