var data = {
    "builders": {
        "menuName" : "Builders",
        "subMenu" : "project",
        "items": [
            {"id": "builder_1","name": "Chandrodaya","image" : "assets/images/chandrodaya.jpg"},
            {"id": "builder_2","name": "Wadhwa","image" : "assets/images/wadhwa.jpg"}
        ]
    },
    "projects":{
        "menuName" : "Projects",
        "subMenu" : "unit_plan",
        "items":[
            {"id" : "project_1_1","builderId" : "builder_1","name" : "Krishna Bhoomi"},
            {"id" : "project_2_1","builderId" : "builder_2","name" : "Wadhwa Anmol Fortune"}
        ]
    },
    "unitPlans":{
        "menuName" : "Unit Plans",
        "subMenu" : "",
        "items":[
            {"id":"unit_1_1_1","projectId":"project_1_1","name":"Type-D<span class='avbl-unit truncate'>23 Available</span>"},
            {"id":"unit_1_1_2","projectId":"project_1_1","name":"Type-E<span class='avbl-unit truncate'>1 Available</span>"},
            {"id":"unit_1_1_3","projectId":"project_1_1","name":"Gopal Kutir 1st Floor<span class='avbl-unit truncate truncate'>6 Av...</span>"},
            {"id":"unit_1_1_4","projectId":"project_1_1","name":"Gopal Kutir G Floor<span class='avbl-unit truncate'>12 Av...</span>"},
            {"id":"unit_1_1_5","projectId":"project_1_1","name":"Keshav Kutir 1st Floor<span class='avbl-unit truncate'>7 Av...</span>"},
            {"id":"unit_1_1_6","projectId":"project_1_1","name":"Keshav Kutir G Floor<span class='avbl-unit truncate'>22 Av...</span>"},
            {"id":"unit_2_1_1","projectId":"project_2_1","name":"2 BHK<span class='avbl-unit truncate'>4 Available</span>"},
            {"id":"unit_2_1_2","projectId":"project_2_1","name":"2.5 BHK<span class='avbl-unit truncate'>18 Available</span>"},
            {"id":"unit_2_1_3","projectId":"project_2_1","name":"3 BHK<span class='avbl-unit truncate'>10 Available</span>"}
        ]
    }
};