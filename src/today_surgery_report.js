import axios from 'axios';
import moment from 'moment';


let todayotbooking = [];
let pendingOtBooking = [];
let postponedOtBooking = [];
let cancelledOtBooking = [];
let mobile = '918875627151';
let surgery_status =
    [
        {
            "id": "1_done",
            "title": "Completed"
        },
        {
            "id": "2_pending",
            "title": "Pending"
        },
        {
            "id": "3_postponed",
            "title": "Postponed"
        },
        {
            "id": "4_cancelled",
            "title": "Cancelled"
        }
    ];

let selected_surgery = '';
let selected_action = '';


const fetchtodayotbooking = async () => {
    try {
        const response = await axios.get('https://online.sahajhospital.com/api/method/hospital.wa_flow.fetch_today_ot_bookings_completed');
        todayotbooking = response.data.message;

    } catch (error) {
        console.error("Error fetching today's OT bookings:", error);
        // Handle error if API call fails
        throw new Error("Error fetching today's OT bookings");
    }
};


const fetchPendingTodayOt = async () => {
    try {
        const response = await axios.get('https://online.sahajhospital.com/api/method/hospital.wa_flow.fetch_today_ot_bookings_pending');
        pendingOtBooking = response.data.message;

    } catch (error) {
        console.error("Error fetching today's OT bookings:", error);
        // Handle error if API call fails
        throw new Error("Error fetching today's OT bookings");
    }
};

const fetchPostpondTodayOt = async () => {
    try {
        const response = await axios.get('https://online.sahajhospital.com/api/method/hospital.wa_flow.fetch_today_ot_bookings_postponed');
        postponedOtBooking = response.data.message;
      

    } catch (error) {
        console.error("Error fetching today's OT bookings:", error);
        // Handle error if API call fails
        throw new Error("Error fetching today's OT bookings");
    }
};

const fetchCancelledTodayOt = async () => {
    try {
        const response = await axios.get('https://online.sahajhospital.com/api/method/hospital.wa_flow.fetch_today_ot_bookings_cancelled');
        cancelledOtBooking = response.data.message;

    } catch (error) {
        console.error("Error fetching today's OT bookings:", error);
        // Handle error if API call fails
        throw new Error("Error fetching today's OT bookings");
    }
};


// To navigate to a screen, return the corresponding response from the endpoint. Make sure the response is enccrypted.
const SCREEN_RESPONSES = {
    SURGERY: {
        "version": "3.0",
        "screen": "SURGERY",
        "data": {
            "mobile": "918000000000",
            "surgeryStatus": [
                {
                    "id": "1_done",
                    "title": "Completed"
                },
                {
                    "id": "2_pending",
                    "title": "Pending"
                },
                {
                    "id": "3_postponed",
                    "title": "Postponed"
                },
                {
                    "id": "4_cancelled",
                    "title": "Cancelled"
                }
            ]
        }
    },
    COMPLETED: {
        "version": "3.0",
        "screen": "COMPLETED",
        "data": {
            "mobile": "918000000000",
            "surgeryStatus": "Example",
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
            ]
        }
    },
    PENDING: {
        "version": "3.0",
        "screen": "PENDING",
        "data": {
            "mobile": "918000000000",
            "surgeryStatus": "Example",
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
            ]
        }
    },
    POSTPONED: {
        "version": "3.0",
        "screen": "POSTPONED",
        "data": {
            "mobile": "918000000000",
            "surgeryStatus": "Example",
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
            ]
        }
    },
    CANCELLED: {
        "version": "3.0",
        "screen": "CANCELLED",
        "data": {
            "mobile": "918000000000",
            "surgeryStatus": "Example",
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
            ]
        }
    },
    NORECORD: {
        "version": "3.0",
        "screen": "NORECORD",
        "data": {
            "mobile": "918000000000",
            "surgeryStatus": "Completed"
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
export const TodaySurgeryReport = async (decryptedBody) => {
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
        return {
            ...SCREEN_RESPONSES.SURGERY,
            data: {
                surgeryStatus: surgery_status,
                surgery: todayotbooking,
                mobile: mobile,
            },
        };
    }

    if (action === "data_exchange") {
        // Handle request based on the current screen
        switch (screen) {

            case "SURGERY":
                let surgeryStatus = data.surgeryStatus;
                if (surgeryStatus == "1_done") {
                    await fetchtodayotbooking()
                    let response;


                    if (todayotbooking.length === 0) {
                        response = {
                            ...SCREEN_RESPONSES.NORECORD,
                            data: {
                                surgeryStatus: data.surgeryStatus,
                                mobile: mobile,
                            }
                        };
                    } else {
                        response = {
                            ...SCREEN_RESPONSES.COMPLETED,
                            data: {
                                surgeryStatus: data.surgeryStatus,
                                surgery: todayotbooking,
                                mobile: data.mobile
                            }
                        };
                    }
                    return response;

                };

                if (surgeryStatus == "2_pending") {
                    await fetchPendingTodayOt()
                    let response;

                    if (pendingOtBooking.length === 0) {
                        response = {
                            ...SCREEN_RESPONSES.NORECORD,
                            data: {
                                surgeryStatus: data.surgeryStatus,
                                mobile: mobile,
                            }
                        };
                    } else {

                        response = {
                            ...SCREEN_RESPONSES.PENDING,
                            data: {
                                surgeryStatus: data.surgeryStatus,
                                surgery: pendingOtBooking,
                                mobile: data.mobile
                            }
                        };
                    }
                    return response;
                };

                if (surgeryStatus == "3_postponed") {
                    await fetchPostpondTodayOt()
                    let response;
                    if (postponedOtBooking.length === 0) {
                        response = {
                            ...SCREEN_RESPONSES.NORECORD,
                            data: {
                                surgeryStatus: data.surgeryStatus,
                                mobile: mobile,
                            }
                        };
                    } else {
                        response = {
                            ...SCREEN_RESPONSES.POSTPONED,
                            data: {
                                surgeryStatus: data.surgeryStatus,
                                surgery: postponedOtBooking,
                                mobile: data.mobile
                            }
                        };
                    }
                    return response;
                };

                if (surgeryStatus == "4_cancelled") {
                    await fetchCancelledTodayOt()
                    let response;
                    if (cancelledOtBooking.length === 0) {
                        response = {
                            ...SCREEN_RESPONSES.NORECORD,
                            data: {
                                surgeryStatus: data.surgeryStatus,
                                mobile: mobile,
                            }
                        };
                    } else {
                        response = {
                            ...SCREEN_RESPONSES.CANCELLED,
                            data: {
                                surgeryStatus: data.surgeryStatus,
                                surgery: cancelledOtBooking,
                                mobile: data.mobile
                            }
                        };
                    }
                    return response;
                };


            case "COMPLETED":
                return {
                    ...SCREEN_RESPONSES.SUCCESS,
                    data: {

                        extension_message_response: {
                            params: {
                                flow_token,
                                surgery: data.surgery,
                                surgeryStatus: data.surgeryStatus,
                                mobile: data.mobile


                            },
                        },
                    },
                };

            case "PENDING":
                // Return the next screen response
                return {
                    ...SCREEN_RESPONSES.SUCCESS,
                    data: {
                        extension_message_response: {

                            params: {
                                flow_token,
                                surgery: data.surgery,
                                surgeryStatus: data.surgeryStatus,
                                mobile: data.mobile

                            },
                        },
                    },
                };

            case "POSTPONED":
                selected_action = data.surgeryStatus;
                return {
                    ...SCREEN_RESPONSES.SUCCESS,
                    data: {
                        extension_message_response: {

                            params: {
                                flow_token,
                                surgery: data.surgery,
                                surgeryStatus: selected_action,
                                mobile: data.mobile
                            },
                        },
                    },
                };

            case "CANCELLED":
                selected_action = data.surgeryStatus;
                return {
                    ...SCREEN_RESPONSES.SUCCESS,
                    data: {
                        extension_message_response: {

                            params: {
                                flow_token,
                                surgery: data.surgery,
                                surgeryStatus: selected_action,
                                mobile: data.mobile


                            },
                        },
                    },
                };


            case "NORECORD":
                let noresponse
                noresponse = {
                    ...SCREEN_RESPONSES.SURGERY,
                    data: {
                        surgeryStatus: surgery_status,
                        mobile: mobile
                    }
                };

                return noresponse;


            default:
                break;
        }
    }

    if (action === "BACK") {
        // Handle request based on the current screen
        switch (screen) {
            case "COMPLETED":
                let responses;
                responses = {
                    ...SCREEN_RESPONSES.SURGERY,
                    data: {
                        surgeryStatus: surgery_status,
                        surgery: todayotbooking,
                        mobile: mobile
                    }
                };

                return responses;


            case "PENDING":
                let response;
                response = {
                    ...SCREEN_RESPONSES.SURGERY,
                    data: {
                        surgeryStatus: surgery_status,
                        surgery: todayotbooking,
                        mobile: mobile
                    }
                };

                return response;

            case "POSTPONED":
                let respons;
                respons = {
                    ...SCREEN_RESPONSES.SURGERY,
                    data: {
                        surgeryStatus: surgery_status,
                        surgery: todayotbooking,
                        mobile: mobile
                    }
                };

                return respons;

            case "CANCELLED":
                let res;
                res = {
                    ...SCREEN_RESPONSES.SURGERY,
                    data: {
                        surgeryStatus: surgery_status,
                        surgery: todayotbooking,
                        mobile: mobile
                    }
                };
                return res;

            case "NORECORD":
                let noresponses
                noresponses = {
                    ...SCREEN_RESPONSES.SURGERY,
                    data: {
                        surgeryStatus: surgery_status,
                        mobile: mobile
                    }
                };

                return noresponses;
            default:
                break;
        }
    }

    console.error("Unhandled request body:", decryptedBody);
    throw new Error("Unhandled endpoint request. Make sure you handle the request action & screen logged above.");
};