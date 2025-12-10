Setup Instructions:- 

  1.Clone the Repository with git clone .... and then run npm install to install all the dependencies.
  
  2.To connect to MongoDB Atlas database you will be requiring a connection uri add URI = YOUR MONGODB ATLAS URI in .env file
  
  3.also add PORT = 3000 to .env file
  
  4.then go to terminal and to project directory and run node server.js and server will be started.

Architectural Explanation:-

  The Backend server is using MVC pattern, for batchprocessing of names list, i am running a loop (.map) and hitting the normalize.io api without await ans saving all the   promises it is returning in an array.
  
  then i am calling Promise.allSettled to get a list of results that are successfull and that failed below is the code snippet.

  const fetchPromises = names.map((name) => getDataFromNormalizeApi(name));

    const results = await Promise.allSettled(fetchPromises);

    const successfulResults = [];
    const failedResults = [];

    const dataToSave = results
      .filter((result, index) => {
        if (result.status === "fulfilled" && !result.value.error) {
          successfulResults.push(result.value);
          return true;
        } else {
          const name = names[index];
          failedResults.push({
            name,
            reason:
              result.reason?.message ||
              result.value?.error ||
              "API call failed",
          });
          return false;
        }
      })

For BackgoundTask (cron-job)
I had isCrmSynced property in my lead schema which was by default false and once the lead is synced it is set to true which also solved the Idempotency issue below is the screen shot of background tasks running 

<img width="810" height="131" alt="Screenshot from 2025-12-10 00-45-23" src="https://github.com/user-attachments/assets/13d4fa9d-f75f-4dd9-af24-e4d3186873c2" />

below is the screenshot of the task when no leads were there to sync (solving Idempotency)

<img width="810" height="167" alt="Screenshot from 2025-12-10 00-51-57" src="https://github.com/user-attachments/assets/25832f93-1e3c-43ea-9e3b-3f6adbd2536a" />

below are screenshots of database data

<img width="1081" height="605" alt="Screenshot from 2025-12-10 00-53-47" src="https://github.com/user-attachments/assets/522c365f-8a9d-4f14-b10d-f5ae7cbea40d" />

<img width="1081" height="605" alt="Screenshot from 2025-12-10 00-53-54" src="https://github.com/user-attachments/assets/3502a0f0-86c4-4f93-80d9-1339200ee05f" />





      
