rs.initiate(
  {
    _id: "rs0", 
    members: [
      { _id: 0, host: "db:27017" } 
    ]
  },
  { force: true } 
);

sleep(5000);