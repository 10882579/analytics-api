const { Admin, Product, Sale, Contractor, Payment } = require('./models');

const randomToken = require('random-token');
const bcrypt = require("bcrypt");

const checkSession = (token) => {
  return new Promise( (resolve, reject) => {
    Admin.findOne({session: token}, (err, admin) => {
      if(admin){
        resolve(200);
      }
      else {
        reject(403);
      }
    })
  })
}

module.exports = {
  checkSession: (req, res) => {
    const token = req.headers['x-auth-token'];
    checkSession(token).then( (status) => {
      res.status(status).send({})
    })
    .catch( (err) => res.status(err).send({}) );
  },
  register: (req, res) => {
    const { email, password } = req.body;
    bcrypt.genSalt(10, (err, salt) => {
      if(salt){
        bcrypt.hash(password, salt, (err, hash) => {
          Admin.create({email: email, password: hash}, (err, admin) => {
            res.status(200).send({});
          })
        })
      }
      else{
        res.status(403).send({});
      }
    })
  },
  login: (req, res) => {
    const { email, password } = req.body;

    Admin.findOne({email: email}, (err, admin) => {
      if (admin) {
        bcrypt.compare(password, admin.password, (err, result) => {
          if(result){
            const token = randomToken(32);
            admin.session = token;
            admin.save();
            res.status(200).send({token: token});
          }
          else{
            res.status(404).send({});
          }
        })
      }
      else{
        res.status(404).send({});
      }
    })
  },
  productList: (req, res) => {
    const token = req.headers['x-auth-token'];

    checkSession(token).then( () => {
      Product.find({}).select("-__v -createdAt -updatedAt")
      .exec( (err, list) => {
        if (err) res.status(400).send({});
        res.status(200).send(list);
      })
    })
    .catch( () => res.status(403).send({}) );

  },
  addNewProduct: (req, res) => {
    const token = req.headers['x-auth-token'];

    checkSession(token).then( () => {
      Product.create(req.body, (err, doc) => {
        if (err) res.status(400).send({added: false});
        res.status(200).send(doc);
      })
    })
    .catch( () => res.status(403).send({}) );
  },
  deleteProduct: (req, res) => {
    const token = req.headers['x-auth-token'];
    const { id } = req.params;

    checkSession(token).then( () => {
      Product.findByIdAndDelete(id, (err) => {
        if (err) res.status(400).send({});
        res.status(200).send({});
      })
    })
    .catch( () => res.status(403).send({}) );
  },
  addNewContractor: (req, res) => {
    const token = req.headers['x-auth-token'];
    
    checkSession(token).then( () => {
      Contractor.create(req.body, (err, doc) => {
        if (err) res.status(400).send({added: false});
        res.status(200).send(doc);
      })
    })
    .catch( () => res.status(403).send({}) );
  },
  contractorList: (req, res) => {
    const token = req.headers['x-auth-token'];

    checkSession(token).then( () => {
      Contractor.find({}).select("-__v -createdAt -updatedAt -sales")
      .exec( (err, list) => {
        if (err) res.status(400).send({});
        res.status(200).send(list);
      })
    })
    .catch( () => res.status(403).send({}) );
  },
  addNewSale: (req, res) => {
    const token = req.headers['x-auth-token'];
    const contrId = req.body.customer;
    const prodId = req.body.product;
    
    checkSession(token).then( () => {
      Contractor.findById(contrId, (err, contractor) => {
        Product.findById(prodId, (err, product) => {
          if(contractor && product){
            Sale.create(req.body, (err, sale) => {
              sale.populate('product', (err, sale) => {
                res.status(200).send(sale);
              })
            })
          }
          else{
            res.status(400).send({added: false});
          }
        });
      })
    })
    .catch( () => res.status(403).send({}) );
  },
  contractorSales: (req, res) => {
    const token = req.headers['x-auth-token'];
    const { id } = req.params;
    
    checkSession(token).then( () => {
      Sale.find({customer: id})
      .populate("product").select("-customer").exec( (err, sale) => {
        if (!sale) res.status(200).send([]);
        if (sale) res.status(200).send(sale);
      })
    })
    .catch( () => res.status(403).send({}) );
  },
  addNewPayment: (req, res) => {
    const token = req.headers['x-auth-token'];
    const contrId = req.body.customer;
    
    checkSession(token).then( () => {
      Contractor.findById(contrId, (err, contractor) => {
        if(contractor){
          Payment.create(req.body, (err, payment) => {
            res.status(200).send(payment);
          })
        }
        else{
          res.status(400).send({added: false});
        }
      })
    })
    .catch( () => res.status(403).send({}) );
  },
  contractorPayments: (req, res) => {
    const token = req.headers['x-auth-token'];
    const { id } = req.params;
    
    checkSession(token).then( () => {
      Payment.find({customer: id})
      .select("-customer").exec( (err, payments) => {
        if (!payments) res.status(200).send([]);
        if (payments) res.status(200).send(payments);
      })
    })
    .catch( () => res.status(403).send({}) );
  },
}