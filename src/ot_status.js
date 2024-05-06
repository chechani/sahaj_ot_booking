import axios from 'axios';
import moment from 'moment';

// let doctor = [];
// let dept = [];
let todayotbooking = [];
let services_used = [
	{
		"id": "1_service",
		"title": "Service 1"
	},
	{
		"id": "2_service",
		"title": "Service 2"
	},
	{
		"id": "3_service",
		"title": "Service 3"
	}

];
let selected_surgery = '';
let selected_action = '';
let selected_room = '';
let doctor = '';
let anaesthetic = '';
let patient = '';
let ipd = '';
let in_time = '';
let out_time = '';
let vacant_rooms = [];
let surgery_status =
	[
		{
			"id": "1_done",
			"title": "Completed"
		},
		{
			"id": "2_postponed",
			"title": "Postponed"
		},
		{
			"id": "3_cancelled",
			"title": "Cancelled"
		}
	];
let mobile = '';

const fetchtodayotbooking = async () => {
	try {
		const response = await axios.get('https://online.sahajhospital.com/api/method/hospital.wa_flow.fetch_today_ot_bookings');
		todayotbooking = response.data.message;
		// todayotbooking = []

	} catch (error) {
		console.error("Error fetching today's OT bookings:", error);
		// Handle error if API call fails
		throw new Error("Error fetching today's OT bookings");
	}
};

const fetchVacantRooms = async () => {
	try {
		const response = await axios.get('https://online.sahajhospital.com/api/method/hospital.wa_flow.get_room_list');
		vacant_rooms = response.data.data;

	} catch (error) {
		console.error("Error fetching today's OT bookings:", error);
		// Handle error if API call fails
		throw new Error("Error fetching today's OT bookings");
	}
};


const fetchServicesUsed = async () => {
	try {
		// const response = await axios.get('https://online.sahajhospital.com/api/method/hospital.wa_flow.fetch_today_ot_bookings');
		services_used = services_used

	} catch (error) {
		console.error("Error fetching today's OT bookings:", error);
		// Handle error if API call fails
		throw new Error("Error fetching today's OT bookings");
	}
};



const fetchOtDetails = async (selected_surgery) => {
	console.log("Passed selected_surgery:", selected_surgery);

	if (!selected_surgery) {
		console.error("Selected surgery is undefined or null");
		throw new Error("Selected surgery ID is required");
	}

	try {
		const response = await axios.get(`https://online.sahajhospital.com/api/method/hospital.wa_flow.fetch_ot_details?ot_id=${encodeURIComponent(selected_surgery)}`, {
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			}
		});

		if (response.data && response.data.message && !response.data.message.error) {
			doctor = response.data.message.surgeon;
			anaesthetic = response.data.message.anaesthetic;
			console.log(`Doctor: ${doctor}, Anaesthetist: ${anaesthetic}`);
		} else {
			console.error("Invalid or empty response data");
			throw new Error("Received invalid data from the server");
		}
	} catch (error) {
		console.error("Error fetching OT details:", error);
		throw new Error("Error fetching OT details due to API or network issue");
	}
};


// To navigate to a screen, return the corresponding response from the endpoint. Make sure the response is enccrypted.
const SCREEN_RESPONSES = {
	SURGERY: {
		"version": "3.0",
		"screen": "SURGERY",
		"data": {
			"mobile": "918000000000",
			"surgery": [
				{
					"id": "1_surgery",
					"title": "Surgery 1"
				},
				{
					"id": "2_surgery",
					"title": "Surgery 2"
				},
				{
					"id": "3_surgery",
					"title": "Surgery 3"
				}
			],
			"doctor": "Dr Bhagchand Chechani",
			"anesthetic": "Dr Gopal Chechani",
			"surgeryStatus": [
				{
					"id": "1_done",
					"title": "Completed"
				},
				{
					"id": "2_postponed",
					"title": "Postponed"
				},
				{
					"id": "3_cancelled",
					"title": "Cancelled"
				}
			]
		}
	},
	COMPLETION: {
		"version": "3.0",
		"screen": "COMPLETION",
		"data": {
			"mobile": "918000000000",
			"surgery": "Example",
			"doctor": "Example",
			"anesthetic": "Example",
			"surgeryStatus": "Example",
			"roomNo": [
				{
					"id": "1_room",
					"title": "Room 1"
				},
				{
					"id": "2_room",
					"title": "Room 2"
				},
				{
					"id": "3_room",
					"title": "Room 3"
				}
			]
		}
	},
	SERVICES: {
		"version": "3.0",
		"screen": "SERVICES",
		"data": {
			"mobile": "918000000000",
			"servicesUsed": [
				{
					"id": "1_service",
					"title": "Service 1"
				},
				{
					"id": "2_service",
					"title": "Service 2"
				},
				{
					"id": "3_service",
					"title": "Service 3"
				}
			],
			"surgery": "Example",
			"nameOfPatient": "Example",
			"ipdNo": "Example",
			"otInTime": "Example",
			"otOutTime": "Example",
			"roomNo": "Example",
			"doctor": "Example",
			"anesthetic": "Example",
			"surgeryStatus": "Example"
		}
	},
	POSTPONEMENT: {
		"version": "3.0",
		"screen": "POSTPONEMENT",
		"data": {
			"mobile": "918000000000",
			"surgery": "Example",
			"surgeryStatus": "Example"
		}
	},
	CANCELLATION: {
		"version": "3.0",
		"screen": "CANCELLATION",
		"data": {
			"mobile": "918000000000",
			"surgery": "Example",
			"surgeryStatus": "Example"
		}
	},
	BLANK: {
		"version": "3.0",
		"screen": "BLANK",
		"data": {
			"mobile": "918000000000"
		}
	},
	NORECORD: {
		"version": "3.0",
		"screen": "NORECORD",
		"data": {
			"mobile": "918000000000",
			"surgeryStatus": "Example"
		}
	},
	SUCCESS: {
		"version": "3.0",
		"screen": "SUCCESS",
		"data": {
			"extension_message_response": {
				"params": {
					"flow_token": "REPLACE_FLOW_TOKEN",
					"some_param_name": "PASS_CUSTOM_VALUE"
				}
			}
		}
	},
};
// Function to handle next screen request
export const OtStatusScreen = async (decryptedBody) => {
	const { screen, data, version, action, flow_token } = decryptedBody;

	// Handle ping action
	if (action === "ping") {
		return {
			version,
			data: {
				status: "active",
			},
		};
	}

	// Handle error notification
	if (data?.error) {
		console.warn("Received client error:", data);
		return {
			version,
			data: {
				acknowledged: true,
			},
		};
	}

	// Handle initial request
	if (action === "INIT") {
		await fetchtodayotbooking();
		doctor = '';
		anaesthetic = '';
		console.log("todayotbooking:", todayotbooking);

		// let response
		if (todayotbooking.length === 0) {
			return {

				...SCREEN_RESPONSES.BLANK,
				data: {

					mobile: mobile,

				},
			};
		} else {
			return {

				...SCREEN_RESPONSES.SURGERY,
				data: {
					surgery: todayotbooking,
					surgeryStatus: surgery_status,
					doctor: doctor,
					anesthetic: anaesthetic,
					mobile: mobile,

				},
			};
		}
	}

	if (action === "data_exchange") {
		// Handle request based on the current screen
		switch (screen) {
			case "SURGERY":
				console.log("surgey_selected:", data);

				if (!doctor) {
					selected_surgery = data.surgery;
					await fetchOtDetails(selected_surgery);
					selected_action = data.surgeryStatus;

					let response;

					response = {
						...SCREEN_RESPONSES.SURGERY,
						data: {
							surgery: todayotbooking,
							surgeryStatus: data.surgeryStatus,
							// surgeryStatus: surgery_status,
							doctor: `Doctor: ${doctor}`,
							anesthetic: `Anesthetic: ${anaesthetic}`,
							mobile: data.mobile,
						},
					};

					return response;
				}

				if (doctor) {

					selected_action = data.surgeryStatus;
					console.log("selected_action:", selected_action);

					if (selected_action === '1_done') {
						await fetchVacantRooms();
						let response;

						response = {
							...SCREEN_RESPONSES.COMPLETION,
							data: {
								surgery: selected_surgery,
								surgeryStatus: selected_action,
								doctor: doctor,
								anesthetic: anaesthetic,
								roomNo: vacant_rooms,
								mobile: data.mobile
							}
						};

						return response;
					};

					if (selected_action === '2_postponed') {
						let response;

						response = {
							...SCREEN_RESPONSES.POSTPONEMENT,
							data: {
								surgery: selected_surgery,
								surgeryStatus: selected_action,
								doctor: doctor,
								anesthetic: anaesthetic,
								mobile: data.mobile
							}
						};

						return response;
					}

					if (selected_action === '3_cancelled') {
						let response;

						response = {
							...SCREEN_RESPONSES.CANCELLATION,
							data: {
								surgery: selected_surgery,
								surgeryStatus: selected_action,
								doctor: doctor,
								anesthetic: anaesthetic,
								mobile: data.mobile
							}
						};
						return response;
					}

				}

			case "COMPLETION":
				console.log("action_choosen:", data);
				await fetchServicesUsed();
				selected_room = data.roomNo;
				selected_action = data.surgeryStatus;
				patient = data.nameOfPatient;
				ipd = data.ipdNo;
				in_time = data.otInTime;
				out_time = data.otOutTime;
				console.log("selected_room:", selected_room);
				// Return the next screen response
				let response;

				response = {
					...SCREEN_RESPONSES.SERVICES,
					data: {
						surgery: selected_surgery,
						surgeryStatus: selected_action,
						doctor: doctor,
						anesthetic: anaesthetic,
						roomNo: selected_room,
						// doctor: doctor,
						nameOfPatient: patient,
						otInTime: in_time,
						otOutTime: out_time,
						ipdNo: ipd,
						anesthetic: anaesthetic,
						servicesUsed: services_used,
						mobile: data.mobile,
					}
				};
				return response;

			case "SERVICES":
				// Return the next screen response
				return {
					...SCREEN_RESPONSES.SUCCESS,
					data: {
						extension_message_response: {

							params: {
								flow_token,
								surgery: selected_surgery,
								surgeryStatus: selected_action,
								doctor: doctor,
								anesthetic: anaesthetic,
								roomNo: selected_room,
								nameOfPatient: patient,
								otInTime: in_time,
								otOutTime: out_time,
								ipdNo: ipd,
								anesthetic: anaesthetic,
								servicesUsed: services_used,
								mobile: data.mobile

							},
						},
					},
				};

			case "POSTPONEMENT":
				console.log("checkdata2:", data);
				selected_action = data.surgeryStatus;
				console.log("selected_action:", selected_action);

				return {
					...SCREEN_RESPONSES.SUCCESS,
					data: {
						extension_message_response: {

							params: {
								flow_token,
								surgery: selected_surgery,
								surgeryStatus: selected_action,
								doctor: doctor,
								anesthetic: anaesthetic,
								reasonForPostponement: data.reasonForPostponement,
								rebookOt: data.rebookOt,
								mobile: data.mobile

							},
						},
					},
				};

			case "CANCELLATION":
				console.log("checkdata2:", data);
				selected_action = data.surgeryStatus;
				console.log("selected_action:", selected_action);

				return {
					...SCREEN_RESPONSES.SUCCESS,
					data: {
						extension_message_response: {

							params: {
								flow_token,
								surgery: selected_surgery,
								surgeryStatus: selected_action,
								doctor: doctor,
								anesthetic: anaesthetic,
								reasonForCancellation: data.reasonForCancellation,
								mobile: data.mobile


							},
						},
					},
				};

			default:
				break;
		}
	}

	if (action === "BACK") {
		// Handle request based on the current screen
		switch (screen) {
			case "COMPLETION":

				return {
					...SCREEN_RESPONSES.SURGERY,
					data: {
						surgeryStatus: surgery_status,
						surgery: todayotbooking,
						doctor: `Doctor: ${doctor}`,
						anesthetic: `Anesthetic: ${anaesthetic}`,
						mobile: mobile,

					},
				};




			case "POSTPONEMENT":
				return {
					...SCREEN_RESPONSES.SURGERY,
					data: {
						surgeryStatus: surgery_status,
						surgery: todayotbooking,
						doctor: `Doctor: ${doctor}`,
						anesthetic: `Anesthetic: ${anaesthetic}`,
						mobile: mobile,

					},
				};

			case "CANCELLATION":
				return {
					...SCREEN_RESPONSES.SURGERY,
					data: {
						surgeryStatus: surgery_status,
						surgery: todayotbooking,
						doctor: `Doctor: ${doctor}`,
						anesthetic: `Anesthetic: ${anaesthetic}`,
						mobile: mobile,

					},
				};
			default:
				break;
		}
	}

	console.error("Unhandled request body:", decryptedBody);
	throw new Error("Unhandled endpoint request. Make sure you handle the request action & screen logged above.");
};