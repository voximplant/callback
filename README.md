VoxEngine scenario for callback functionality
=========

This project lets developers implement callback functionality using [VoxImplant] platform. This README file describes how to use the provided [VoxEngine] scenario and [HTTP API] to make calls to 2 phone numbers and connect them with each other. Special URL (media_session_access_url) can be used to control the running scenario via HTTP (RPC). The only thing you need to start building your callback scenarios is VoxImplant developer account - you can get it for free at https://voximplant.com/sign-up

Quickstart
----
After you successfully created and activated your VoxImplant developer account you need to login into VoxImplant admin interface and complete these steps to have your callback scenario ready to be executed:

- Create new scenario in Scenarios tab by copying and pasting the provided code (callback.js)
- Create new application in Applications tab and specify the Rule for the application that will be used to launch the scenario using HTTP API (rule id is required to launch the scenario remotely)
- Make HTTP request using the [StartScenarios] function of VoxImplant [HTTP API] , phone numbers should be specified using script_custom_data parameter as a string number1:number2

Version
----
1.0

[VoxImplant]:http://voximplant.com
[VoxEngine]:https://voximplant.com/docs/introduction/introduction_to_voximplant/capabilities_and_components/voxengine
[HTTP API]:http://voximplant.com/docs/references/httpapi/
[StartScenarios]:https://voximplant.com/docs/references/httpapi/scenarios#startscenarios
