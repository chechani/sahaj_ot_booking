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

const fetchTimeList = async (date,requested_minutes) => {
	try {
		const response = await axios.get(`https://online.sahajhospital.com/api/method/hospital.wa_flow.available_slots?requested_minutes=${requested_minutes}&date=${date}`);
		console.log("bccresponse", response.data);
		time_list = response.data.message.map(department => ({
			id: department.id.toString(), // Convert id to string
			title: department.title,
		}));
	} catch (error) {
		console.error("Error fetching Time list:", error);
		// Handle error if API call fails
		throw new Error("Error fetching Time list");
	}
};

const otConfirmation = async (bookingDetails) => {
	try {
		const data = {
			department: bookingDetails.department,
			date: bookingDetails.date,
			slot: bookingDetails.slot,
			start_time_requested: bookingDetails.preferred_time,
			anaesthetic: bookingDetails.anesthetic_name,
			mobile: bookingDetails.mobile,
		};

		const response = await axios.post('https://online.sahajhospital.com/api/method/hospital.wa_flow.create_ot_booking', data);
		// console.log("response", response.data.data);

		const ot_booking = {
			ot: response.data.data[0].ot,
			date: response.data.data[0].date,
			start_time: response.data.data[0].start_time,
			end_time: response.data.data[0].end_time,
			anesthetic_name: response.data.data[0].anesthetic_name
		};

		// console.log("book", ot_booking);
		return ot_booking;
	} catch (error) {
		console.error("Error fetching OT Confirmation:", error);
		// Handle error if API call fails
		throw new Error("Error fetching OT Confirmation");
	}
};

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

// Define screen responses

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
            "slot": "10:30",
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
            "ot": "OT 1",
            "date": "2024-01-01",
            "start_time": "10:30",
            "end_time": "10:30",
            "anesthetic_name": "General Anesthesia"
        }
    },
    SUCCESS: {
        "version": "3.0",
        "screen": "SUCCESS",
        "data": {
            "extension_message_response": {
                "params": {
                    "flow_token": "750caadc-0e93-419c-b7ea-49098105706c",
                    "some_param_name": "PASS_CUSTOM_VALUE"
                }
            }
        }
    },
};

// Function to handle next screen request
export const getNextScreen = async (decryptedBody) => {
	const { screen, data, version, action, flow_token } = decryptedBody;

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

				const date = data.date;
				const slot_id = data.slot;
				const slots = [
					{'id': "1", 'title': '30 Min'},
					{'id': "2", 'title': '60 Min'},
					{'id': "3", 'title': '90 Min'},
					{'id': "4", 'title': '120 Min'},
					{'id': "5", 'title': '150 Min'},
					{'id': "6", 'title': '180 Min'},
					{'id': "7", 'title': '210 Min'}
				];
				const requested_minutes = parseInt(slots.find(slot => slot.id === slot_id).title);

				await fetchTimeList(date, requested_minutes);

				if (anaesthetics_list.length === 0) {
					await fetchAnaestheticsList();
				}

				return {
					...SCREEN_RESPONSES.QUESTION_TWO,
					data: {
						department: data.department,
						date: data.date,
						slot: data.slot,
						preferred_time: time_list,
						anesthetic_name: anaesthetics_list,
						mobile: data.mobile,
						is_time_enabled: true,
					}
				};

			case "QUESTION_TWO":
				//wriite a function to get preferred time title based on id from time_list
				const pref_id = data.preferred_time;
				const slot_duration = data.slot;

				const getPreferredTimeTitle = (pref_id) => {
					const time = time_list.find(time => time.id === pref_id);
					return time ? time.title : "";
				}

				console.log("pref_id", getPreferredTimeTitle);
				console.log("slot_duration", slot_duration);
				console.log("myslots", slot_list);
				const slot_size= [
					{'id': "1", 'title': '30'},
					{'id': "2", 'title': '60'},
					{'id': "3", 'title': '90'},
					{'id': "4", 'title': '120'},
					{'id': "5", 'title': '150'},
					{'id': "6", 'title': '180'},
					{'id': "7", 'title': '210'}
				];

				const modifiedSlotDuration = slot_size.find(slot => slot.id === slot_duration).title;
				
				const bookingDetails = {
					department: data.department,
					date: data.date,
					slot: modifiedSlotDuration,
					anesthetic_name: data.anesthetic_name,
					preferred_time: getPreferredTimeTitle(pref_id),
					mobile: data.mobile,
				};
				// console.log("booking",bookingDetails);
				const otBookingResult = await otConfirmation(bookingDetails);
				// console.log("erpbooking", otBookingResult);
				// Return the next screen response				
				return {
					...SCREEN_RESPONSES.QUESTION_THREE,
					data: {
						
						ot: otBookingResult.ot,
						date: otBookingResult.date,
						start_time: otBookingResult.start_time,
						end_time: otBookingResult.end_time,
						anesthetic_name: otBookingResult.anesthetic_name
					}
				};

			case "QUESTION_THREE":
			
				return {
					...SCREEN_RESPONSES.SUCCESS,
					data: {
						extension_message_response: {
							params: {
								flow_token,
							},
						},
					},
				};

			default:
				break;
		}
	}

	console.error("Unhandled request body:", decryptedBody);
	throw new Error("Unhandled endpoint request. Make sure you handle the request action & screen logged above.");
};