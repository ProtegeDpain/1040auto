import { Icons } from "@/components/ui/icons";

export const companyClientList = [
	{
		companyName: "Company A",
		clientName: "Client 1",
		clientId: 1,
		softwareType: "VPN+RDC",
	},
	{
		companyName: "Company B",
		clientName: "Client 2",
		clientId: 2,
		softwareType: "RDC",
	},
];

export const subClientList = [
	{ subClientName: "Sub Client 1", subClientId: 1 },
	{ subClientName: "Sub Client 2", subClientId: 2 },
];

export const softwareTypes = [
	{ value: "VPN+RDC", label: "VPN + RDC" },
	{ value: "RDC", label: "RDC Only" },
	{ value: "Splashtop", label: "Splashtop" },
];

export const mockTimeline = [
	{
		label: "Files Uploaded",
		date: "2025-05-23 10:30:00",
		icon: <Icons.page className="h-6 w-6 text-green-600" />,
		downloadable: false,
		active: true,
		downloadLabel: "",
	},
	{
		label: "Pending",
		date: "2025-05-23 10:35:00",
		icon: <Icons.spinner className="h-6 w-6 animate-spin text-yellow-600" />,
		downloadable: false,
		active: true,
		downloadLabel: "",
	},
	{
		label: "Workbook Created",
		date: "2025-05-23 10:40:00",
		icon: <Icons.post className="h-6 w-6 text-green-600" />,
		downloadable: true,
		active: true,
		downloadLabel: "Workbook",
	},
	{
		label: "Drake Report Created",
		date: "2025-05-23 10:45:00",
		icon: <Icons.post className="h-6 w-6 text-green-600" />,
		downloadable: true,
		active: true,
		downloadLabel: "Drake Report",
	},
	{
		label: "Lead Sheet Created",
		date: "",
		icon: <Icons.post className="h-6 w-6 text-gray-400" />,
		downloadable: true,
		active: false,
		downloadLabel: "Lead Sheet",
	},
	{
		label: "Completed",
		date: "",
		icon: <Icons.check className="h-6 w-6 text-gray-400" />,
		downloadable: false,
		active: false,
		downloadLabel: "",
	},
];

export const initialMockTasks = [
	{
		client: "Acme Corporation",
		subClient: "Subsidiary A",
		software: "Drake",
		softwareType: "VPN+RDC",
		status: "uploading",
		lastProcessDate: "2025-06-10",
	},
	{
		client: "Beta Industries",
		subClient: "Branch B",
		software: "Drake",
		softwareType: "RDC",
		status: "pending",
		lastProcessDate: "2025-06-10",
	},
	{
		client: "Gamma Solutions",
		subClient: "Division C",
		software: "Drake",
		softwareType: "Splashtop",
		status: "workbook",
		lastProcessDate: "2025-06-10",
	},
	{
		client: "Delta Corp",
		subClient: "Unit D",
		software: "Drake",
		softwareType: "VPN+RDC",
		status: "drake",
		lastProcessDate: "2025-06-10",
	},
	{
		client: "Epsilon Ltd",
		subClient: "Group E",
		software: "Drake",
		softwareType: "RDC",
		status: "leadsheet",
		lastProcessDate: "2025-06-10",
	},
	{
		client: "Zeta Inc",
		subClient: "Section F",
		software: "Drake",
		softwareType: "Splashtop",
		status: "completed",
		lastProcessDate: "2025-06-10",
	},
];

export interface TaskFormData {
    // Task Related Fields
	filing_status_id: number;
    task_uid: string;
    client_id: number;
    sub_client_id: number;
    tax_year: number;
    resident_state: string;
    
    // Software Related Fields
    software_type: string;
    software_name: string;
    software_exe_path: string;
    software_ip_address: string;
    software_username: string;
    software_password: string;

    // VPN Related Fields
    vpn_name: string;
    vpn_exe_path: string;
    vpn_ip_address: string;
    vpn_username: string;
    vpn_password: string;

    // RDC Related Fields
    rdc_name: string;
    rdc_exe_path: string;
    rdc_ip_address: string;
    rdc_username: string;
    rdc_password: string;

    // Splashtop Related Fields
    splashtop_email: string;
    splashtop_password: string;
    
    // Display only fields (not saved)
    client_name: string;
    sub_client_name: string;
    company_name: string;
    network_access_type: string;
}

export const initialFormState: TaskFormData = {
    task_uid: "",
	filing_status_id: 1,
    client_id: 0,
    sub_client_id: 0,
    tax_year: 2024,
    resident_state: "",
    
    // Software Related Fields
    software_type: "",
    software_name: "Drake", // Default to Drake
    software_exe_path: "",
    software_ip_address: "",
    software_username: "",
    software_password: "",

    // VPN Related Fields
    vpn_name: "",
    vpn_exe_path: "",
    vpn_ip_address: "",
    vpn_username: "",
    vpn_password: "",

    // RDC Related Fields
    rdc_name: "",
    rdc_exe_path: "",
    rdc_ip_address: "",
    rdc_username: "",
    rdc_password: "",
    
    // Splashtop Related Fields
    splashtop_email: "",
    splashtop_password: "",

    // Display only fields (not saved)
    client_name: "",
    sub_client_name: "",
    company_name: "",
    network_access_type: ""
};