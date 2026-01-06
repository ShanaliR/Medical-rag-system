import axios from 'axios';

async function executeTool(toolName, toolInput) {
  if (toolName === "get_leave_balance") {
    try {
      const employee_id = toolInput.employeeId;

      console.log("Fetching leave balance for employee_id:", employee_id);

      // In production, make actual API call.
      // The API needs the employee_id in the request body. Use POST so the JSON body is sent.
      const response = await axios.post(`https://hris-backend.akz.lk/api/v1/leaves`, 
        { employee_id: employee_id },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      console.log("HRIS API Response:", response);
      const data = response.data;

      return data;
    } catch (error) {
      return { error: error.message };
    }
  }

  if (toolName === "request_leave") {
    try {
      const { emp_id, name, period, type, status = "pending", date, notes } = toolInput;
      console.log("Requesting leave with input:", toolInput);

      console.log("Submitting leave request for employee:", emp_id);

      // Make the API call to submit the leave request
      const response = await axios.post(
        `https://hris-backend.akz.lk/api/v1/request/save`,
        {
          emp_id,
          name,
          period,
          type,
          status,
          date,
          notes: notes || ""
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("Leave Request Response:", response);
      const data = response.data;

      return {
        success: true,
        requestId: data.request_id,
        status: data.status,
        message: data.message
      };
    } catch (error) {
      return { 
        success: false,
        error: error.message 
      };
    }
  }

  return { error: "Unknown tool" };
}

export { executeTool };