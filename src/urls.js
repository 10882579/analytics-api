const controllers = require("./controllers");

module.exports = (app) => {
  app.get("/check-session/", controllers.checkSession);
  app.get("/products/list/", controllers.productList);
  app.get("/contractors/list/", controllers.contractorList);
  app.get("/contractors/:id/sales/", controllers.contractorSales);

  app.post("/login/", controllers.login);
  app.post("/register/", controllers.register);
  app.post("/products/add-new/", controllers.addNewProduct);
  app.post("/products/:id/delete/", controllers.deleteProduct);
  app.post("/contractors/add-new/", controllers.addNewContractor);
  app.post("/sales/add-new/", controllers.addNewSale);
}