// Import required modules
import axios from 'axios';
import moment from 'moment';


// Define global variables
let department_list = [];
let time_list = [];
let date_list = [];
let slot_list = [];
let anaesthetics_list = [];
let doctor_mobile = '';

// // Function to fetch department list from the API
const fetchDepartmentList = async () => {
	try {
		const response = await axios.get('https://online.sahajhospital.com/api/method/hospital.wa_flow.doctor_department_surgery?mobile=8109066434');
		department_list = response.data.data.surgeries;
		doctor_mobile = response.data.data.doctor_mobile;
		console.log("mobile_data", doctor_mobile);
	} catch (error) {
		console.error("Error fetching department list:", error);
		// Handle error if API call fails
		throw new Error("Error fetching department list");
	}
};

const fetchDepartmentListNew = async (mobile) => {
	try {
		const response = await axios.get('https://online.sahajhospital.com/api/method/hospital.wa_flow.doctor_department_surgery?mobile=' + mobile);
		department_list = response.data.data.surgeries;
		doctor_mobile = response.data.data.doctor_mobile;
		console.log("mobile_data", doctor_mobile);
	} catch (error) {
		console.error("Error fetching department list:", error);
		// Handle error if API call fails
		throw new Error("Error fetching department list");
	}
};

const fetchAnaestheticsList = async () => {
	try {
		const response = await axios.get('https://online.sahajhospital.com/api/method/hospital.wa_flow.get_all_anaesthetics');
		anaesthetics_list = response.data.data;
	} catch (error) {
		console.error("Error fetching department list:", error);
		// Handle error if API call fails
		throw new Error("Error fetching department list");
	}
};

// const fetchTimeList = async (date,requested_minutes) => {
// 	try {
// 		const response = await axios.get(`https://online.sahajhospital.com/api/method/hospital.wa_flow.available_slots?requested_minutes=${requested_minutes}&date=${date}`);
// 		// console.log("bccresponse", response.data);
// 		time_list = response.data.message.map(department => ({
// 			id: department.id.toString(), // Convert id to string
// 			title: department.title,
// 		}));
// 	} catch (error) {
// 		console.error("Error fetching Time list:", error);
// 		// Handle error if API call fails
// 		throw new Error("Error fetching Time list");
// 	}
// };


const fetchTimeList = async (date, requested_minutes) => {
	try {
		const response = await axios.get(`https://online.sahajhospital.com/api/method/hospital.wa_flow.available_slots?requested_minutes=${requested_minutes}&date=${date}`);
		// console.log("bccresponse", response.data);
		if (response.data.message.length === 0) {
			time_list = [];
		}
		else {
			time_list = response.data.message.map(department => ({
				id: department.id.toString(), // Convert id to string
				title: department.title,
			}));
		}
	} catch (error) {
		console.error("Error fetching Time list:", error);
		// Handle error if API call fails
		throw new Error("Error fetching Time list");
	}
};


// const fetchTimeList = async (date, requested_minutes) => {
// 	try {
// 		// const response = await axios.get(`https://online.sahajhospital.com/api/method/hospital.wa_flow.available_slots?requested_minutes=${requested_minutes}&date=${date}`);
// 		// console.log("bccresponse", response.data);
// 		time_list = [];
// 	} catch (error) {
// 		console.error("Error fetching Time list:", error);
// 		// Handle error if API call fails
// 		throw new Error("Error fetching Time list");
// 	}
// };

const generateDateJSON = () => {
	const dates = [];
	for (let i = 0; i < 10; i++) {
		const date = moment().add(i, 'days');
		dates.push({
			id: date.format('YYYY-MM-DD'),
			title: date.format('ddd MMM DD YYYY')
		});
	}
	return dates;
};

// // Function to generate slots duation
const generateSlotDurations = () => {
	const slot = [
		{ id: "1", title: '30 Min' },
		{ id: "2", title: '60 Min' },
		{ id: "3", title: '90 Min' },
		{ id: "4", title: '120 Min' },
		{ id: "5", title: '150 Min' },
		{ id: "6", title: '180 Min' },
		{ id: "7", title: '210 Min' }
	];
	return slot;
};

// //function to fetch slots list
const fetchSlotList = async () => {
	slot_list = generateSlotDurations();
};


// Function to fetch date list
const fetchDateList = async () => {
	date_list = generateDateJSON();
};

const SCREEN_RESPONSES = {
	QUESTION_ONE: {
		"version": "3.0",
		"screen": "QUESTION_ONE",
		"data": {
			"department": [
				{
					"id": "shopping",
					"title": "Shopping & Groceries"
				},
				{
					"id": "clothing",
					"title": "Clothing & Apparel"
				},
				{
					"id": "home",
					"title": "Home Goods & Decor"
				},
				{
					"id": "electronics",
					"title": "Electronics & Appliances"
				},
				{
					"id": "beauty",
					"title": "Beauty & Personal Care"
				}
			],
			"slot": [
				{
					"id": "1",
					"title": "30 Min"
				},
				{
					"id": "2",
					"title": "60 Min"
				},
				{
					"id": "3",
					"title": "90 Min"
				},
				{
					"id": "4",
					"title": "120 Min"
				}
			],
			"date": [
				{
					"id": "2024-01-01",
					"title": "Mon Jan 01 2024"
				},
				{
					"id": "2024-01-02",
					"title": "Tue Jan 02 2024"
				},
				{
					"id": "2024-01-03",
					"title": "Wed Jan 03 2024"
				}
			],
			"is_date_enabled": true,
			"mobile": "918875627151"
		}
	},
	QUESTION_TWO: {
		"version": "3.0",
		"screen": "QUESTION_TWO",
		"data": {
			"department": "Total Knee Replacement U\/L",
			"mobile": "918875627151",
			"date": "2024-01-01",
			"slot": "90 Min",
			"preferred_time": [
				{
					"id": "1",
					"title": "08:00"
				},
				{
					"id": "2",
					"title": "09:00"
				},
				{
					"id": "3",
					"title": "11:00"
				},
				{
					"id": "4",
					"title": "12:30"
				}
			],
			"anesthetic_name": [
				{
					"id": "Dr_Rahul_Jain",
					"title": "Dr. Rahul Jain"
				},
				{
					"id": "Dr_Vinod_Jain",
					"title": "Dr Vinod Jain"
				}
			],
			"is_time_enabled": true
		}
	},
	QUESTION_THREE: {
		"version": "3.0",
		"screen": "QUESTION_THREE",
		"data": {
			"department": "Total Knee Replacement U\/L",
			"mobile": "918875627151",
			"date": "2024-01-01",
			"slot": "90 Min",
			"is_time_enabled": true
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
export const getNextScreen = async (decryptedBody) => {
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
		// Fetch department list if it's empty
		if (department_list.length === 0) {
			await fetchDepartmentList();
		}

		// Fetch date list if it's empty
		if (date_list.length === 0) {
			await fetchDateList();
		}

		// Fetch slot list if it's empty
		if (slot_list.length === 0) {
			await fetchSlotList();
		}

		return {
			...SCREEN_RESPONSES.QUESTION_ONE,
			data: {
				department: department_list,
				date: date_list,
				slot: slot_list,
				is_date_enabled: true,
				mobile: doctor_mobile,

			},
		};
	}

	// Handle data exchange action
	if (action === "data_exchange") {
		// Handle request based on the current screen
		switch (screen) {
			case "QUESTION_ONE":
				// Update the appointment fields based on current user selection

				if (anaesthetics_list.length === 0) {
					await fetchAnaestheticsList();
				}

				const date = data.date;
				const slot_id = data.slot;
				const slots = [
					{ 'id': "1", 'title': '30 Min' },
					{ 'id': "2", 'title': '60 Min' },
					{ 'id': "3", 'title': '90 Min' },
					{ 'id': "4", 'title': '120 Min' },
					{ 'id': "5", 'title': '150 Min' },
					{ 'id': "6", 'title': '180 Min' },
					{ 'id': "7", 'title': '210 Min' }
				];
				const requested_minutes = parseInt(slots.find(slot => slot.id === slot_id).title);

				// const choosen_minutes = slots.find(slot => slot.id === slot_id).title;

				const choosen_minutes = requested_minutes.toString();

				await fetchTimeList(date, requested_minutes);

				let response;

				if (time_list.length === 0) {
					response = {
						...SCREEN_RESPONSES.QUESTION_THREE,
						data: {
							department: data.department,
							date: data.date,
							slot: choosen_minutes,
							anesthetic_name: anaesthetics_list,
							mobile: data.mobile,
							is_time_enabled: true,
						}
					};
				} else {
					response = {
						...SCREEN_RESPONSES.QUESTION_TWO,
						data: {
							department: data.department,
							date: data.date,
							slot: choosen_minutes,
							preferred_time: time_list,
							anesthetic_name: anaesthetics_list,
							mobile: data.mobile,
							is_time_enabled: true,
							ot_remarks: data.ot_remarks
						}
					};
				}

				return response;

			case "QUESTION_TWO":
				//wriite a function to get preferred time title based on id from time_list
				const pref_id = data.preferred_time;
				const getPreferredTimeTitle = (pref_id) => {
					const time = time_list.find(time => time.id === pref_id);
					return time ? time.title : "";
				}

				console.log("pref_id", pref_id);
				console.log("getPreferredTimeTitle", getPreferredTimeTitle(pref_id));
				// Return the next screen response
				return {
					...SCREEN_RESPONSES.SUCCESS,
					data: {
						extension_message_response: {

							params: {
								flow_token,
								department: data.department,
								date: data.date,
								slot: data.slot,
								anesthetic_name: data.anesthetic_name,
								preferred_time: getPreferredTimeTitle(pref_id),
								mobile: data.mobile,
								ot_remarks: data.ot_remarks
							},
						},
					},
				};

			case "QUESTION_THREE":
				//wriite a function to get preferred time title based on id from time_list

				if (department_list.length === 0) {
					await fetchDepartmentListNew(data.mobile);
				}

				// Fetch date list if it's empty
				if (date_list.length === 0) {
					await fetchDateList();
				}

				// Fetch slot list if it's empty
				if (slot_list.length === 0) {
					await fetchSlotList();
				}

				// Return the next screen response
				return {
					...SCREEN_RESPONSES.QUESTION_ONE,
					data: {
						department: department_list,
						date: date_list,
						slot: slot_list,
						is_date_enabled: true,
						mobile: doctor_mobile,

					},
				};

			default:
				break;
		}
	}

	console.error("Unhandled request body:", decryptedBody);
	throw new Error("Unhandled endpoint request. Make sure you handle the request action & screen logged above.");
};