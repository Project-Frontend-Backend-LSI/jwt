const Freelancer = require('../schema/freelancer');
const Service = require('../schema/services');
const Token = require('../schema/token');
const jwt = require("jsonwebtoken");
require('dotenv').config();
const bcrypt = require('bcrypt');


const BCRYPT_NUMBER = process.env.BCRYPT_NUMBER;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRE_TIME = process.env.JWT_EXPIRE_TIME;
const resolvers = {
    Query: {
      freelancers: async () => {//OK
          try {
            const allUsers = await Freelancer.find({});
            return allUsers;
          } catch (error) {
            console.log(error);
            return [];
          }
      },
      freelancerById: async (_, { id }) => {//OK
          try {
            const user = await Freelancer.findById(id);
            return user;
          } catch (err) {
            throw new Error(`Failed to fetch freelancer: ${err}`);
          }
        },
        freelancerLogin: async (_, { email, password }) => {
            const user = await Freelancer.findOne({email:email});
            if(!user || !(await bcrypt.compare(password, user.password))) throw new Error('Invalid email or password '); 
            const token = jwt.sign({
              idFreelancer: user.id,
            }, JWT_SECRET, {
                expiresIn: JWT_EXPIRE_TIME
            });
            return {
              idFreelancer: user.id,
              token: token,
              tokenExpiration: JWT_EXPIRE_TIME +"h"
            };
        },
        servicesOfFreelancer: async (_, { idfreelancer }) => {//OK
          try {
            const freelancerServices = await Service.find({idfreelancer: idfreelancer});
            return freelancerServices;
          } catch (error) {
            throw new Error(`Error : ${error}`);
          }
        },
    },
    Mutation: {
      createFreelancer: async (_, { username, email, password, country, phone, description }) => {
        // Check if a user with the same username or email already exists
        const existingUser = await Freelancer.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
          if (existingUser.email === email) {
              throw new Error('Email already in use');
          } else if (existingUser.username === username) {
              throw new Error('Username already taken');
          }
        }
        //Hash password
        const hashedPassword = await bcrypt.hash(password, +BCRYPT_NUMBER);
        // Create and save the new user
        const user = new Freelancer({ username, email, password:hashedPassword, country, phone, description });
        user.save();
        //token
        const token = jwt.sign({
          idFreelancer: user.id,
        }, JWT_SECRET, {
            expiresIn: JWT_EXPIRE_TIME
        });
        //Create token freelancer in collection token and save
        const tokenFreelancer = new Token({idFreelancer:user.id,token:token,date:new Date(now.getTime() + JWT_EXPIRE_TIME * 60 * 60 * 1000)});
        tokenFreelancer.save();
        return {
          idFreelancer: user.id,
          token: token,
          tokenExpiration: JWT_EXPIRE_TIME +"h"
        };
      },
      updateFreelancer: async (_, { id,username, password, country, phone, description }, { request }) => {//Ok
        let hashedPassword;
        if(password){
          //Hash password
          hashedPassword = await bcrypt.hash(password, +BCRYPT_NUMBER);
        }
        try {
          const updatedUser = await Freelancer.findByIdAndUpdate(
            id,
            { username, password:hashedPassword, country, phone, description },
            { new: true }
          );
          return updatedUser;
        } catch (err) {
          throw new Error(`Failed to update freelancer: ${err}`);
        }
      },
      deleteFreelancer: async (_, { id }) => {//OK
          try {
            const deletedUser = await Freelancer.findByIdAndRemove(id);
            return deletedUser;
          } catch (error) {
            throw new Error(`Failed to delete freelancer: ${error}`);
          }
        },
      createService: async (_,{title, subtitle, description, subdescription, category, delevrytime, price, idfreelancer})=>{
        const existingUser = await Freelancer.findById(idfreelancer);
        if (!existingUser) {
          throw new Error('Freelancer not exists');
        }
        const existingService = await Service.findOne({ $and: [{ title }, { idfreelancer }] });
        if (existingService) {
          throw new Error('Service already exists');
        }
        // Create and save the new user
        const service = new Service({ title, subtitle, description, subdescription, category, delevrytime, price, idfreelancer });
        return service.save();
      },
      updateService: async (_, { id, title, subtitle, description, subdescription, category, delevrytime, price, idfreelancer }) => {//Ok
        try {
          const updatedService = await Service.findByIdAndUpdate(
            id,
            { title, subtitle, description, subdescription, category, delevrytime, price },
            { new: true }
          );
          return updatedService;
        } catch (err) {
          throw new Error(`Failed to update freelancer: ${err}`);
        }
      },
      deleteService: async (_, { id }) => {//OK
        try {
          const deletedUser = await Service.findByIdAndRemove(id);
          return deletedUser;
        } catch (error) {
          throw new Error(`Failed to delete freelancer: ${error}`);
        }
      }
    },
  };

module.exports = resolvers;