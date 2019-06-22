const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} = require("graphql");

const axios = require("axios");
//Hard coded data
// const customers = [
//     {id:"1", name:'john doe', email:'jdoe@gmail.com', age:'35'},
//     {id:"2", name:'phillpe', email:'phill@gmail.com', age:'12'},
//     {id:"3", name:'jacob', email:'jackob@gmail.com', age:'23'},
//     {id:"4", name:'favour', email:'pheavey@gmail.com', age:'20'},
// ]

//customer type
const CustomerType = new GraphQLObjectType({
  name: "Customer",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    age: { type: GraphQLInt }
  })
});

//Root Query

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    customer: {
      type: CustomerType,
      args: {
        id: { type: GraphQLString }
      },
      resolve(parentValue, args) {
        /* for(let i = 0; i < customers.length; i++){
                    if(customers[i].id == args.id){
                       return customers[i];
                    }
                } */
        return axios
          .get("http://localhost:3000/customers/" + args.id)
          .then(res => res.data);
      }
    },
    customers: {
      type: new GraphQLList(CustomerType),
      resolve(parentValue, args) {
        // return customers;
        return axios
          .get("http://localhost:3000/customers")
          .then(res => res.data);
      }
    }
  }
});

//mutation
const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addCustomer: {
      type: CustomerType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve(parentValue, args) {
        return axios
          .post("http://localhost:3000/customers", {
            name: args.name,
            email: args.email,
            age: args.age
          })
          .then(res => res.data);
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
});
