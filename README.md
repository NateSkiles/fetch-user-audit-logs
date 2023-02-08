# Fetch User Audit Logs
This script queries the [audit-logs](https://developer.kustomer.com/kustomer-api-docs/reference/getauditlogs) endpoint and writes events to a CSV for events where the user changed their status.

---

## Instructions:
1. Run ```yarn```
2. Update ```.env.example``` file name to ```.env```
3. Add Kustomer API Key with ```org.permission.audit_logs.read``` permissions to the ```.env``` file
4. Run ```yarn start``` and enter a User ID when pompted. That user's work-sessions will be written to a CSV in ```./output/```

---

Note: If you would like to change the headers in the CSV file, you can edit the 'headers' variable in app.js. 

To add additional headers, add an object to the headers array with the following format:<br/>
```{ id: "ATTRIBUTE", title: "NAME OF COLUM" }```