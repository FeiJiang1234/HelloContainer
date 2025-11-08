package container.auth

import future.keywords.every
import future.keywords.in

default GET_Container_GetContainers_0 = false
GET_Container_GetContainers_0 {
	input.method == "GET"
	input.path == ["containers"]
}

default POST_Container_CreateContainer_0 = false
POST_Container_CreateContainer_0 {
	input.method == "POST"
	input.path == ["containers"]
}

is_admin_role(role) {
	role.roleName == "administrator"
}