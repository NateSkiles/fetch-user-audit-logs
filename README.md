# Fetch User Audit Logs

1. Run ```yarn```
2. Update ```.env.example``` file name to ```.env```
3. Add Kustomer API Key with ```org.permission.audit_logs.read``` permissions to the ```.env``` file
4. Update the User ID const in app.js to the user ID you wish to query and save
5. Run ```yarn start``` and that a CSV of that user's work-session audit logs will be exported to ```./output/```