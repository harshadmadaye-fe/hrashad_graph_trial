const express = require('express')
const expressGraphQL = require('express-graphql').graphqlHTTP
const app = express()

const{
GraphQLSchema,
GraphQLObjectType,
GraphQLString,
GraphQLList,
GraphQLInt,
GraphQLNonNull
} = require('graphql')

const programs = [
    {id: 1, name: 'Face Yoga'},
    {id: 2, name: 'Mind Yoga'},
    {id: 3, name: 'Weight Loss'},
]

const videos = [
    {id: 1, name: 'Day 1: Anti-aging face massage for all', programId: 1, video_url: 'https://d136w34xi8hav0.cloudfront.net/Body/4-Day_Yoga_for_Therapy_Reproductive_Organs/Let_the_tension_flow/01-Let_the_tension_flow_TUTORIAL_EDIT_01_720.mp4'},
    {id: 2, name: 'Day 2: Yoga for slimmer face', programId: 1, video_url: 'https://d136w34xi8hav0.cloudfront.net/Body/4-Day_Yoga_for_Therapy_Reproductive_Organs/Let_the_tension_flow/01-Let_the_tension_flow_TUTORIAL_EDIT_01_720.mp4'},
    {id: 3, name: 'Day 3: Yoga for puffy eyes and dark circles', programId: 1, video_url: 'https://d136w34xi8hav0.cloudfront.net/Body/4-Day_Yoga_for_Therapy_Reproductive_Organs/Let_the_tension_flow/01-Let_the_tension_flow_TUTORIAL_EDIT_01_720.mp4'},
    {id: 4, name: 'Day 4: Yoga for face wrinkles', programId: 1, video_url: 'https://d136w34xi8hav0.cloudfront.net/Body/4-Day_Yoga_for_Therapy_Reproductive_Organs/Let_the_tension_flow/01-Let_the_tension_flow_TUTORIAL_EDIT_01_720.mp4'},
    {id: 5, name: 'Awaking The Root Chakra', programId: 2, video_url: 'https://d136w34xi8hav0.cloudfront.net/Body/4-Day_Yoga_for_Therapy_Reproductive_Organs/Let_the_tension_flow/01-Let_the_tension_flow_TUTORIAL_EDIT_01_720.mp4'},
    {id: 6, name: 'Calming Flute Melody', programId: 2, video_url: 'https://d136w34xi8hav0.cloudfront.net/Body/4-Day_Yoga_for_Therapy_Reproductive_Organs/Let_the_tension_flow/01-Let_the_tension_flow_TUTORIAL_EDIT_01_720.mp4'},
    {id: 7, name: 'Flow With Your Thoughts', programId: 2, video_url: 'https://d136w34xi8hav0.cloudfront.net/Body/4-Day_Yoga_for_Therapy_Reproductive_Organs/Let_the_tension_flow/01-Let_the_tension_flow_TUTORIAL_EDIT_01_720.mp4'},
    {id: 8, name: 'Deep stretch flow: yoga basics', programId: 3, video_url: 'https://d136w34xi8hav0.cloudfront.net/Body/4-Day_Yoga_for_Therapy_Reproductive_Organs/Let_the_tension_flow/01-Let_the_tension_flow_TUTORIAL_EDIT_01_720.mp4'},
    {id: 8, name: 'Core conditioning: Start strong', programId: 3, video_url: 'https://d136w34xi8hav0.cloudfront.net/Body/4-Day_Yoga_for_Therapy_Reproductive_Organs/Let_the_tension_flow/01-Let_the_tension_flow_TUTORIAL_EDIT_01_720.mp4'},
    {id: 8, name: 'Intense detox flow: The cleanser', programId: 3, video_url: 'https://d136w34xi8hav0.cloudfront.net/Body/4-Day_Yoga_for_Therapy_Reproductive_Organs/Let_the_tension_flow/01-Let_the_tension_flow_TUTORIAL_EDIT_01_720.mp4'},
]

const ProgramType  = new GraphQLObjectType({
    name: 'Program',
    descriptionL: 'This represents Programs',
    fields: () => ({
        id: {type: GraphQLNonNull(GraphQLInt)},
        name: {type: GraphQLNonNull(GraphQLString)},
        videos: {
            type: GraphQLList(VideoType),
            resolve: (program) => {
                return videos.filter(video => video.programId === program.id)
            }
        }
    })
})

const VideoType  = new GraphQLObjectType({
    name: 'Video',
    descriptionL: 'This represents videos of program',
    fields: () => ({
        id: {type: GraphQLNonNull(GraphQLInt)},
        name: {type: GraphQLNonNull(GraphQLString)},
        programId: {type: GraphQLNonNull(GraphQLInt)},
        video_url: {type: GraphQLNonNull(GraphQLString)},
        program: {
            type: ProgramType,
            resolve: (Video) => {
                return programs.find(program => program.id === Video.programId)
            }
        }
    })
})

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        video: {
            type: VideoType,
            description: 'Single Video By ID',
            args: {
                id: {type: GraphQLInt}
            },
            resolve: (parent, args) => videos.find(video => video.id === args.id)
        },
        videos: {
            type: new GraphQLList(VideoType),
            description: 'List Of Videos',
            resolve: () => videos
        },
        programs: {
            type: new GraphQLList(ProgramType),
            description: 'List Of Programs',
            resolve: () => programs
        },
        program: {
            type: ProgramType,
            description: 'Single Program By ID',
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parent, args) => programs.find( program => program.id === args.id)
        }
    })
})

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        addProgram: {
            type: ProgramType,
            description: 'Add a Program',
            args:{
                name: { type: GraphQLNonNull(GraphQLString)}
            },
            resolve: (parent, args) => {
                const program = {id: programs.length + 1, name: args.name}
                programs.push(program)
                return program
            }
        }
    })
})

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
})

app.use('/graphql', expressGraphQL({
    schema: schema,
    graphiql: true
}))
app.listen(4500., () => console.log('server Running'))
