import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLBoolean,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
} from 'graphql'
import { getAll } from '../../api/users'
import { getAssignments } from '../../api/assignments'

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    username: { type: GraphQLString },
    name: { type: GraphQLString },
    lastname: { type: GraphQLString },
    is_admin: { type: GraphQLBoolean },
    is_superadmin: { type: GraphQLBoolean },
    assignments: {
      type: new GraphQLList(AssignmentType),
      async resolve(parent) {
        return await getAssignments({ user_id: parent.id })
      },
    },
  }),
})

const AssignmentType = new GraphQLObjectType({
  name: 'Assignment',
  fields: () => ({
    id: { type: GraphQLID },
    user_name: { type: GraphQLString },
    expiry_date: { type: GraphQLString },
  }),
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    users: {
      type: new GraphQLList(UserType),
      async resolve() {
        return await getAll()
      },
    },
    assignment: {
      type: AssignmentType,
      args: { id: { type: GraphQLID } },
      async resolve(parent, args) {
        return (await getAssignments({ id: args.id }))[0]
      },
    },
    assignments: {
      type: new GraphQLList(AssignmentType),
      async resolve() {
        return await getAssignments()
      },
    },
  },
})

const mutation = new GraphQLObjectType({
  name: 'MutationType',
  fields: {
    addUser: {
      type: UserType,
      args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        lastname: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(parent, args) {
        // just extract the data from args and create it
        return {
          id: 34,
        }
      },
    },
    /* deleteUser: {
      // ... same as above but delete it in resolve
    }, */
  },
})

export default new GraphQLSchema({
  query: RootQuery,
  mutation,
})
