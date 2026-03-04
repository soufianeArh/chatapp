import { type UserCreatedPayload } from "@chatapp/common"
import { getMongoClient } from "@/clients/mongo.client"
import { type Collection } from "mongodb";
//upsert user
//findbyid

interface UserDocument {
      _id: string;
      email: string;
      displayName: string;
      createdAt: string;
      updatedAt: string;
    }

const getCollection = async (): Promise<Collection<UserDocument>>=>{
      const client = await getMongoClient();
      return client.db().collection<UserDocument>("users");
}

export const userRepository = {
      async upsertUser(payload:UserCreatedPayload): Promise<void>{
            const collection = await getCollection();
            collection.updateOne(
                  {_id:payload.id},
                  { 
                        $set: {
                        _id: payload.id,
                        email: payload.email,
                        displayName: payload.displayName,
                        createdAt: payload.createdAt,
                        updatedAt: payload.updatedAt,
                      },
                  },{
                        upsert: true
                  }
            )
      },
      async findUserById(id:string):Promise<UserDocument | null>{
            const collection = await getCollection();
            return collection.findOne({ _id: id });
      }
}