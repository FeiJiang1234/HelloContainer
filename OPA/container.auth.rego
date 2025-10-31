import future.keywords.every
import future.keywords.in

default GET_Container_GetContainers_0 = false
GET_Container_GetContainers_0 {
	input.method == "GET"
	input.path == ["Containers"]
}