import userModel from '../models/user.model.js';

export default class User {

    getUserById = async (id) => {
        try {
            let user = await userModel.findById(id)
            return user
            
        } catch (error) {
            console.log("no se encuentra el usuario requerido",error)
            return null            
        }
    }

    saveUser = async (user) => {
        try {
        let result = await userModel.create(user);
        return result
  
        } catch (error) {
            console.log("no se puede crear el usuario",error);
        }
    }

    getUserByEmail = async (email) => {
        try {
            let user = await userModel.findOne({ email: email });
            return user;
        } catch (error) {
            console.log("no se puede devolver el usuario con el email requerido",error);
            return null;
        }
    }
}

