# Project: Week 6: To-do list application
## Introduction
As of now, you have completed Project Week 4 and now have a backend implementation where your todo lists are saved to a file. The next step is to create backend services that will return todo lists we have saved to file. If you run the solution from week 4 you'll notice that everytime you create new todo lists, the file they are stored in is updated, but your aren't able to see the currently existing todo lists stored.  By adding these new backend services this week we'll be able to see the stored todo list entries and allow users to query for specific todo lists. In this week's assignmment you'll create two backend services 1) return all todo lists, 2) return all todo lists with a specified name.


## Requirements
Feature requirements (Week5 task is complete when you):
+ Create a backend service to handle a GET request to return all todo lists
+ Create a backend service to handle a GET request to return todo lists that match the name sent as a parameter to this request
Optional
+ From the front-end call the back-end service to get all todo lists currently stored when a user opens the Home page
+ Create UI components (a textbox and a button) in the front-end to facilitate searching 

Implementation requirements:
+ Continue using the front-end and back-end frameworks from week 4.

## Instructions

### GET Service - Return all Services

#### Implementation

1. Open to-do-list/backend/server.js
2. Go to the GET listener "app.get("/get/items", getItems)"
3. At the comment "//begin here" copy/paste/type the following code to read in the todo lists stored in the database.json file:
```
    var data = await fsPromises.readFile("database.json");
```
4. Return a response to whoever called the data we just read in, we will return the data from the file but parsed as JSON data:
```
    response.json(JSON.parse(data));
```
#### Testing
We will test this service using the curl utility.  The curl utility is quite useful because it can send requests to services, simulating consuming applications that would utilize the backend service.

1. Stop the backend service if it's currently running (Ctrl-C the terminal/command window where you did the last "npm start" for the backend)
2. Start the backend service, go to the "to-do-list/backend" directory and install required packages and start the backend:
```
    npm install
    npm start
```

3. Open another terminal or command window.  Type this curl command to send a request to this service:
```
    curl http://localhost:8080/get/items
```

### GET Service - Search for and Return a ToDo List

#### Implementation
1. Open to-do-list/backend/server.js
2. Go to the GET listener "app.get("/get/searchitem",searchItems)"
3. On the line after the comment "//begin here" copy/paste/type the following code, this will retrieve a parameter passed to this service, this parameter will be the name of the Todo List we will search for:
```
    var searchField = request.query.taskname;
```
4. Continue editing this function by adding the following to read in the database 
```
    var json = JSON.parse (await fsPromises.readFile("database.json"));
```
5. Add the following to take the data from the database and apply a filter, this will seperate out only the Todo lists that match our search parameter given to the backend service and stored in "searchField":
```
    var returnData = json.filter(jsondata => jsondata.Task === searchField);
    
```
6. Whether we have data to return (i.e. todo lists that matches the name we're looking for) or not (i.e. there were no todo lists with the name), we return a response to whoever called this service with the following:
```
    response.json(returnData);
```

#### Testing


1. Stop the backend service if it's currently running (Ctrl-C the terminal/command window where you did the last "npm start" for the backend)

2. Start the backend service, go to the "to-do-list/backend" directory and install required packages and start the backend (you can skip the npm install if you ran that already above):
```
    npm install
    npm start
```

3. Open another terminal or command window.  
Contruct a curl command to search for a task: 
``` 
    curl 'http://localhost:8080/get/searchitem?taskname=<nametosearchfor>'
```

So for example, if you want to search for todo lists with a name of "hello", your command would be:
```
    curl 'http://localhost:8080/get/searchitem?taskname=hello'
```

If you want to search for a task name with a space in it, for example "hello world" you will need to use the html code for a space (%20) in your curl command, like this: 
```
    curl 'http://localhost:8080/get/searchitem?taskname=hello%20world'
```

### Optional - Use the UI to Call the Backend Service to Return All Todo Lists

#### Implementation
1. Open the front end component to-do-list/src/component/TodoData.js, on the line after the comment "//begin here" copy/paste/type the following code:
```
        const [todos, setTodos] = useState([]);
        
        useEffect( () => { 
            async function fetchData() {
                try {
                    const res = await Axios.get('http://localhost:8080/get/items'); 
                    setTodos(JSON.stringify(res.data));
                    console.log(JSON.stringify(res.data));
                } catch (err) {
                    console.log(err);
                }
            }
            fetchData();
        }, []);
        return <div>{todos}</div>
```
2. Note the above code does a number of things, it makes use of the "useEffect" hook in react, and the await keyword, this combination is essentially telling react to wait for a call to a backend service to complete, then proceeds with the rest of the render.  Remember that nodeJS is an asynchronous platform, so statements can get executed before data is prepared and ready to return. In the case of our Axios.get above, if we didn't have the await in front of it then the rest of the code will proceed and attempt to render before our response is returned from the backend service.  To solve this we said that this function is asynchronous and hence we will receive a response from the backend service before proceeding.

3. An alternative is you could do something like we've seen in other services, store the response in state and update it as the data is returned, an example of this will be used in the search functionality next.

#### Testing

1. Go to the *to-do-list* directory, if this is the first time running the front-end for this week execute the following:
```
    npm install
    npm audit fix --force
```
2. Start the front end by running the following command in the *to-do-list* directory:
```
    npm start
```

3. Open *another* terminal or command window and go to the *to-do-list/backend* directory and run the backend:
```
    npm start
```

4. Go to a browser and open the front-end, if not open already, http://localhost:3000, this should bring up the home page. Go to the top navigation bar and click on the "TodoPage"

5. Notice on page load that the top of the page is populated with all of your tasks, saved from the backend service.

### Optional - Use the UI to search for a ToDo list

#### Implementation

1. Open the front end component to-do-list/src/component/SearchTodo.js, on the line after the comment "//begin here" copy/paste/type the following code:
```
            e.preventDefault();  
            // HTTP Client to send a GET request
            Axios({
            method: "GET",
            url: "http://localhost:8080/get/searchitem",
            headers: {
                "Content-Type": "application/json" 
            },
            params: {
                taskname: this.state.content
            }
            }).then(res => {
            this.setState({
                tmpdata: JSON.stringify(res.data),
                });
        
            });
```
2. Some things to note, there are some UI components defined in this file, the main things they will do is submit a form which will trigger the call to the searchitem backend service, as part of that submit we will take the name of the Todo to search for from the "this.state.content" parameter, the a user would type in the UI text box.
3. Note also we have state associated with this component "tmpdata", this state will be set to the data returned from the backend service via the "this.setState({tmpdata: JSON.stringify(res.data),});" code we just put in the HandleSubmit method.
4. We will use this state in the render function, underneath the search UI components you'll see "<div>{this.state.tmpdata}</div>", this is empty initially, because we haven't searched for anything, but once you supply a search parameter and click the "Search" button, we will set the state in the HandleSubmit, which will then update the state in our div to hold the return data from the backend service for the search.


#### Testing
1. Go to the *to-do-list* directory, if this is the first time running the front-end for this week execute the following:
```
    npm install
    npm audit fix --force
```
2. Start the front end by running the following command in the *to-do-list* directory:
```
    npm start
```

3. Open *another* terminal or command window and go to the *to-do-list/backend* directory and run the backend:
```
    npm start
```

4. Go to a browser and open the front-end, if not open already, http://localhost:3000, this should bring up the home page. Go to the top navigation bar and click on the "SearchPage" link.

5. Notice the input text box and button that will search for a Todo list in the backend. Type a task name that you know exists or doesn't exist and click the button. (Note if you left the frontend and backend services running after completing the lab steps above make sure you refresh the page so the changes you made load correctly in the browser)

6. Observe the returned value in the div section below the search UI, it will be updated in real-time after we submit the form, returning with the data obtained from the backend.

### Optional - Integration with Cloudant

*Note for this section you'll need an IBM Cloud account, so this might be something to try in later weeks when you will provision IBM Cloud accounts*

#### Create a Cloudant DB

1. Log in to IBM Cloud with your free/trial account.

2. Click "Catalog" along the top right of the page.

3. In the search bar type in "cloudant" and select the first option returned (the cloudant service).

4. Accept all the defaults and scroll to the bottom, the "Lite" plan should be selected which on the right side of the page shows as "free".

5. Click the "Create" button on the lower right side of the page.

6. The cloudant DB will create and make take some minutes to provision. You can view your cloudant resource from the hamburger menu on the top left -> "Resource List", then expand "Databases", your instance will be there and you can monitor it's provisioning progress, when it has a Status of "Active" then it's good to use.

7. Select your Cloudant DB from this page, you will now see a display for managing your cloudant DB. Copy the value for "External endpoint (preferred)".

8. Go to the left side tab and select "Service credentials", now click the "New credential" button, you can specify any name or the default, and select a role of "writer" for now, then click "Add".

9. Once your service credential is created expand it and you should see a number of lines of information, you'll want to copy the value of "apikey", for example:
```
"apikey": "cwo1uoJqYL-I8jb_rDTL333XCZFwu_T2yWVSOHvp_XK_",
```

We will want to copy the value:
```
cwo1uoJqYL-I8jb_rDTL333XCZFwu_T2yWVSOHvp_XK_
```

#### Initialize the Cloudant DB

1. Go to the backend directory and type:
```
npm install @ibm-cloud/cloudant
```

2. Create a cloudant credential with a role of 'writer', get API key from cloud console, use the drop down and copy the "apikey" field value


3. Set our cloudant environment variables, in a command window (this process may vary depending on what type of shell you're using) type the following (inserting the values you copied in the previous section):

```
CLOUDANT_URL= <the value from step 7 in the previous section>
export CLOUDANT_URL
CLOUDANT_APIKEY=<the value from step 9 in the previous section>
export CLOUDANT_APIKEY
```

4. Add the following to end of server.js after the '// Add initDB function here' code block:

```
async function initDB ()
{
    //TODO --- Insert to create DB
    //See example at https://www.npmjs.com/package/@ibm-cloud/cloudant#authentication-with-environment-variables for how to create db
    
    try {
        const todoDBName = "tododb";
        const client = CloudantV1.newInstance({});
        const putDatabaseResult = (
        await client.putDatabase({
        db: todoDBName,
      })
    ).result;
    if (putDatabaseResult.ok) {
      console.log(`"${todoDBName}" database created.`);
    }
  } catch (err) {
   
      console.log(
        `Cannot create "${todoDBName}" database, err: "${err.message}".`
      );

  }
};
```
5. Add toward the top of server.js under the "//Init code for Cloudant" comment

```
const {CloudantV1} = require('@ibm-cloud/cloudant');
if (useCloudant)
{
    initDB();
}
```

6. start the backend
```
npm start
```

7. In server.js near the top, set the useCloudant value from 'false' to 'true', like so:

```
const useCloudant = true;
```

8. What happened? You likely got an error stating "Access is denied due to invalid credentials.", if you look at the cloudant IAM roles [documentation](https://cloud.ibm.com/docs/Cloudant?topic=Cloudant-managing-access-for-cloudant#ibm-cloudant-roles-ai) "writer" does not have permission to create databases. Go to the cloudant management page in IBM cloud, create a new credential with a role of "manager". Copy the apikey value from this new role and set your environment variable to it.


9. stop the backend service, ctrl-c in the window its running in

10. Start the backend service again:
```
npm start
```

11. You should now see the database being create on startup:
```
npm start

> backend@1.0.0 start
> node server.js

Backend server live on 8080
"tododb" database created.
```

#### Store a Todo task in a Cloudant DB

1. In the server.js file add the following to the addItem function after the '//begin here for cloudant' code block:
```
            // Setting `_id` for the document is optional when "postDocument" function is used for CREATE.
            // When `_id` is not provided the server will generate one for your document.
            const todoDocument = { _id: id.stringify };
          
            // Add "name" and "joined" fields to the document
            todoDocument['task'] = task;
            todoDocument.curDate = curDate;
            todoDocument.dueDate = dueDate;
          
            // Save the document in the database with "postDocument" function
            const client = CloudantV1.newInstance({});
            console.log('Writing to: ', todoDBName)
            const createDocumentResponse = await client.postDocument({
              db: todoDBName,
              document: todoDocument,
            });
            console.log('Successfully wrote to cloudant DB');
```
#### Return all items from Cloudant

1. in the server.js file we're going to add code for cloudant to retrieve, but in an if/else block, if we are using cloudant go to cloudant to retrieve, otherwise use the local file as before. To make these changes easily, replace the entire getItems function in server.js as follows:

```
//** week 6, get all items from the json database*/
app.get("/get/items", getItems)
async function getItems (request, response) {
    //begin here

    //begin cloudant here
    if (useCloudant) {
    //add for cloudant client
    const client = CloudantV1.newInstance({});
    var listofdocs;
    await client.postAllDocs({
        db: todoDBName,
        includeDocs: true
    }).then(response => {
        listofdocs=response.result;
        });
    response.json(JSON.stringify(listofdocs));
    }
    else {
    //for non-cloudant use-case
    var data = await fsPromises.readFile("database.json");
    response.json(JSON.parse(data));
    }

};
```


#### Search a Todo Task in Cloudant

1. create index and design document in cloudant


2. In server.js replace your searchItems function code as follows:
```
//** week 6, search items service */
app.get("/get/searchitem", searchItems) 
async function searchItems (request, response) {
    //begin here
    var searchField = request.query.taskname;

    if (useCloudant){
        const client = CloudantV1.newInstance({});
        var search_results
        await client.postSearch({
            db: todoDBName,
            ddoc: 'newdesign',
            query: 'task:'+searchField,
            index: 'newSearch'
          }).then(response => {
            search_results=response.result;
            console.log(response.result);
          });
        console.log(search_results);
        response.json(JSON.stringify(search_results));
        
    }
    else {
    var json = JSON.parse (await fsPromises.readFile("database.json"));
    var returnData = json.filter(jsondata => jsondata.Task === searchField);
    response.json(returnData);
    }
};
```

#### Enable Cloudant code and test
1. If you haven't already set useCloudant to 'true', in server.js near the top, set the useCloudant value from 'false' to 'true', like so:

```
const useCloudant = true;
```

2. Stop the backend server if not already stopped with a cntrl-c, go to the backend directory on a command window and type:
```
npm start
```

3. Start the front-end UI if not already started, from a separate command window go to the top level directory to-do-list, and run:
```
npm start
```

4. Go to the browser and open the front-end url: localhost:3000

5. Try to add a todo item, you should see a message in the backend console after it's added:
```
Writing to:  tododb
Successfully wrote to cloudant DB
```

6. Click on the TodoPage menu link at the top of the webpage:

7. Click on the SearchPage menu link at the top of the webpage, input a task name to search for and observe results returned from cloudant:

## Pre-session Material

What is a REST API
https://www.redhat.com/en/topics/api/what-is-a-rest-api

Rest APIS
https://www.ibm.com/cloud/learn/rest-apis

Microservices Architecture
https://www.ibm.com/cloud/architecture/architectures/microservices

Modernizing Applications
https://www.ibm.com/cloud/architecture/architectures/application-modernization

