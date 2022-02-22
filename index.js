const express = require("express");
const uuid = require("uuid");
const cors = require("cors");

const port = process.env.PORT || 3001;

const server = express();
server.use(express.json());
server.use(cors());

server.use((req, res, next) => {
  res.header("Acess-Control-Allow-Original", "*");

  res.header("Acess-Control-Allow-Methods", 'GET,PUT,POST,DELETE,OPTIONS');
  next();
});

const orders = [];

const checkClientID = (req, resp, next) => {
  const { id } = req.params;

  const index = orders.findIndex((client) => client.id === id);

  if (index < 0) {
    return resp.status(404).json({
      message: "Client not Found",
    });
  }
  req.clientIndex = index;
  req.clientId = id;

  next();
};

const method = (request, response, next) => {
  console.log(request.method);

  next();
};

server.get("/orders", method, (req, resp) => {
  return resp.json(orders);
});

server.post("/orders", method, (req, resp) => {
  try{
  const { order, nameClient, adressClient } = req.body;

  const client = {
    id: uuid.v4(),
    nameClient,
    order,
    adressClient
  };

  orders.push(client);

  return resp.status(201).json(client);
  } catch(err) {
    return response.status(500).json({error:"internal server error"});
  }
});

server.put("/orders/:id", method, checkClientID, (req, resp) => {
  const { nameClient, order, adressClient } = req.body;
  const index = req.clientIndex;
  const id = req.clientId;

  const updatedClient = { id, nameClient, order, adressClient};

  orders[index] = updatedClient;

  return resp.json(updatedClient);
});

server.delete("/orders/:id", method, checkClientID, (req, resp) => {
  const index = req.clientIndex;
  orders.splice(index, 1);

  return resp.status(204).json({
    message: "User as deleted",
  });
});

server.get("/ordersSpecifies/:id", method, checkClientID, (req, resp) => {
  const index = req.clientIndex;
  const id = req.clientId;

  const ordersSpecifies = orders[index];

  return resp.json(ordersSpecifies);
});

/*
server.patch("/orders/:id", method, checkClientID, (req, resp) => {
  const index = req.clientIndex;
  const id = req.clientId;
  const { order, nameClient, adressClient } = orders[index];

  const updatedOrder = { id, order, nameClient, adressClient, status: "Pronto" };

  orders[index] = updatedOrder;

  return resp.json(updatedOrder);
});
*/

server.listen(port, () => {
  console.log("Server Started 🚀");
});
