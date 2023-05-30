const {gql} = require('apollo-server-express');
const Freelancer = require('../schema/freelancer');
const Service = require('../schema/services');

const typeDefs = gql`
  type Freelancer {
    id: ID
    username: String!
    email: String!
    password: String!
    country: String
    phone: String!
    description: String
  }
  type Service {
    id:ID
    title: String!
    subtitle: String!
    description: String!
    subdescription: String!
    category: String!
    delevrytime: String!
    price: String!
    idfreelancer: String!
    }
    type AuthData {
      idFreelancer: ID!,
      token: String!,
      tokenExpiration: Int!,
    },

  type Query {
    # Freelancer queries
    freelancers: [Freelancer]
    freelancerById(id: ID!): Freelancer
    freelancerLogin(email: String!,password:String!): AuthData
    # Service queries
    services: [Service]
    serviceById(id: ID!): Service
    serviceByIdFreelancer(idfreelancer: ID!): Service
    servicesOfFreelancer(idfreelancer: String!):[Service]
  }
  type Mutation {
    # User mutations
    createFreelancer(username:String!, email:String!,password:String!,country:String!,phone:String!,description:String!): AuthData
    updateFreelancer(id:ID!, username:String,password:String,country:String,phone:String,description:String): Freelancer
    deleteFreelancer(id: ID!): Freelancer
    # Service mutations
    createService(title: String!, subtitle: String!, description: String!, subdescription: String!, category: String!, delevrytime: String!, price: String!, idfreelancer: String!): Service
    updateService(id: ID!, title: String, subtitle: String, description: String, subdescription: String, category: String, delevrytime: String, price: String): Service
    deleteService(id: ID!): Service
  }
`;

module.exports = typeDefs;