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

default DELETE_Container_DeleteContainer_1 = false
DELETE_Container_DeleteContainer_1 {
	input.method == "DELETE"
	containerId := input.args[0]
	input.path == ["containers", containerId]
	is_admin_role(input.context)
}

is_admin_role(context) {
	some entry in context.roleLookup
	entry.lookupScope.scope == "user"
	entry.lookupResult.roleName == "administrator"
}