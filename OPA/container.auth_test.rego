package container.auth

import rego.v1

test_GET_Container_GetContainers_0 if {
    input_data := {
        "method": "GET",
        "path": ["containers"]
    }
    
    GET_Container_GetContainers_0 with input as input_data
}

test_POST_Container_CreateContainer_0 if {
    input_data := {
        "method": "POST",
        "path": ["containers"]
    }
    
    POST_Container_CreateContainer_0 with input as input_data
}

test_POST_Container_CreateContainer_0_failed if {
    input_data := {
        "method": "GET",
        "path": ["containers"]
    }
    
    not POST_Container_CreateContainer_0 with input as input_data
}

test_DELETE_Container_DeleteContainer_1 if {
    input_data := {
        "method": "DELETE",
        "path": ["containers", "cc627232-1937-4aa8-8eb1-b77e7cf7f4f8"],
        "args": [
            "cc627232-1937-4aa8-8eb1-b77e7cf7f4f8"
        ],
        "context": {
            "roleLookup": [
                {
                    "lookupScope": {
                        "scope": "container",
                        "scopeRef": "cc627232-1937-4aa8-8eb1-b77e7cf7f4f8"
                    },
                    "lookupResult":  {
                        "roleName": "owner"
                    }
                    
                }
            ]
        }
    }
    
    DELETE_Container_DeleteContainer_1 with input as input_data
}

test_POST_Container_AddWater_1_is_admin if {
    input_data := {
        "method": "POST",
        "path": ["containers", "cc627232-1937-4aa8-8eb1-b77e7cf7f4f8"],
        "context": {
            "roleLookup": [
                {
                    "lookupScope": {
                        "scope": "user",
                        "scopeRef": "36f17b7f-3829-4e61-8106-d9047bd04dc4"
                    },
                    "lookupResult":  {
                        "roleName": "administrator"
                    }
                    
                }
            ],
            "payload": {
                "containerId": "cc627232-1937-4aa8-8eb1-b77e7cf7f4f8"
            }
        }
    }
    
    POST_Container_AddWater_1 with input as input_data
}

test_POST_Container_AddWater_1_is_not_admin if {
    input_data := {
        "method": "POST",
        "path": ["containers", "cc627232-1937-4aa8-8eb1-b77e7cf7f4f8"],
        "context": {
            "roleLookup": [
                {
                    "lookupScope": {
                        "scope": "user",
                        "scopeRef": "36f17b7f-3829-4e61-8106-d9047bd04dc4"
                    },
                    "lookupResult":  {
                        "roleName": "reader"
                    }
                    
                }
            ],
            "payload": {
                "containerId": "cc627232-1937-4aa8-8eb1-b77e7cf7f4f8"
            }
        }
    }
    
    not POST_Container_AddWater_1 with input as input_data
}

test_POST_Container_AddWater_1_is_container_owner if {
    input_data := {
        "method": "POST",
        "path": ["containers", "cc627232-1937-4aa8-8eb1-b77e7cf7f4f8"],
        "args": [
            "cc627232-1937-4aa8-8eb1-b77e7cf7f4f8"
        ],
        "context": {
            "roleLookup": [
                {
                    "lookupScope": {
                        "scope": "container",
                        "scopeRef": "cc627232-1937-4aa8-8eb1-b77e7cf7f4f8"
                    },
                    "lookupResult":  {
                        "roleName": "owner"
                    }
                    
                }
            ],
            "payload": {
                "containerId": "cc627232-1937-4aa8-8eb1-b77e7cf7f4f8"
            }
        }
    }
    
    POST_Container_AddWater_1 with input as input_data
}