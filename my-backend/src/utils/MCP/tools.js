// const TOOLS = [
//   {
//     functionDeclarations: [
//       {
//         name: "get_leave_balance",
//         description:
//           "Retrieves the leave balance for an employee from the HRIS system",
//         parameters: {
//           type: "object",
//           properties: {
//             employeeId: {
//               type: "string",
//               description: "The employee ID to query leave balance for",
//             },
//             leave_type: {
//               type: "string",
//               description:
//                 "Optional: specific leave type (annual, sick, personal, all) defaults to all",
//             },
//           },
//         },
//       },
//       {
//         name: "request_leave",
//         description: "Submit a leave request for an employee",
//         parameters: {
//           type: "object",
//           properties: {
//             emp_id: {
//               type: "string",
//               description: "The employee ID requesting the leave"
//             },
//             name: {
//               type: "string",
//               description: "The name of the employee. can be there or not"
//             },
//             period: {
//               type: "string",
//               description: "The period/duration of the leave. if not specifies explicitly derive from the message"
//             },
//             type: {
//               type: "string",
//               description: "Type of leave. Personal leaves are the leaves that are not annual or sick. it not specifies explicitly put all laves as personal",
//               enum: ["annual", "sick", "personal"]
//             },
//             status: {
//               type: "string",
//               description: "Status of the leave request",
//               default: "pending"
//             },
//             date: {
//               type: "string",
//               description: "The date of the leave request. If not specified, use today's date or derive from the users message"
//             },
//             notes: {
//               type: "string",
//               description: "Additional notes or reason for the leave request"
//             }
//           },
//           required: ["emp_id"]
//         }
//       }
//     ],
//   },
// ];

// export { TOOLS };