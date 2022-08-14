const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const axios = require("axios").default;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
const port = process.env.PORT || 3000;

app.get("/", async (req, res) => {
  res.send("hellloo");
});

app.get("/todos", (req, res) => {
  axios({
    method: "get",
    url: "https://jsonplaceholder.typicode.com/todos",
  })
    .then((response) => {
	  const getFormmatedResult = (response?.data || []).map(({ id, title, completed }) => ({ id, title, completed }))
      res.status(200).json(getFormmatedResult);
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });

  
});


app.get("/users/:id", async (req, res) => {
	const { id } = req?.params || {};

	const apiWithTodos = await axios({
		method: "get",
		url: "https://jsonplaceholder.typicode.com/todos",
	})
	.then((response) => response?.data)
	.catch((err) => res.status(500).json({message: err}));

	const apiContainUser = await axios({
		method: "get",
		url: `https://jsonplaceholder.typicode.com/users/${id}`,
	})
	.then((response) => response?.data)
	.catch((err) => res.status(500).json({message: err}));


	const filterTodos = (apiWithTodos || []).filter(({ userId }) => +userId === +id);

	const formattedResponse = { ...apiContainUser, todos: filterTodos }

	res.status(200).json(formattedResponse);
	
});

app.listen(port, () => {
  console.log(`listening to port ${port}`);
});
