# Fetch User Audit Logs
This script queries the [audit-logs](https://developer.kustomer.com/kustomer-api-docs/reference/getauditlogs) endpoint and writes events to a CSV for events where the user changed their status.

1. Run ```yarn```
2. Update ```.env.example``` file name to ```.env```
3. Add Kustomer API Key with ```org.permission.audit_logs.read``` permissions to the ```.env``` file
5. Run ```yarn start``` and enter a User ID when pompted. That user's work-sessions will be written to a CSV in ```./output/```