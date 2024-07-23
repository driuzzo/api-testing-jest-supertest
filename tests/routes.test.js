const request = require('supertest');
const app = require('../server');
const models = require('../database/models');
const controller = require('../controllers/index')

beforeAll((done) => {
    server = app.listen(3000, done);
});

afterAll(async () => {
    await server.close();
    await models.sequelize.close();
});

describe('create post', () => {
    it('should create a new post', async () => {
        const response = await request(app)
            .post('/api/posts')
            .send({
                userId: 1,
                title: 'This is my first post',
            });
        expect(response.statusCode).toEqual(201);
        expect(response.body).toHaveProperty('post');
    });

    it('should not create a post with no title', async () => {
        const response = await request(app)
            .post('/api/posts')
            .send({
                userId: 1
            })
        expect(response.statusCode).toEqual(400);
        expect(response.body).toHaveProperty('error', 'Title is required');
    });

    it('should not create a post with no id', async () => {
        const response = await request(app)
            .post('/api/posts')
            .send({
                title: 'This is a title'
            })
        expect(response.statusCode).toEqual(400);
        expect(response.body.error).toEqual('UserId is required');
    });
});

describe('existing post', () => {
    const users = 
    [
        {
          name: 'Jane Doe',
          email: 'janedoe@example.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Jon Doe',
          email: 'jondoe@example.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
    ]
    const posts = [
        {          
            userId: 1,
            title: 'post 1',
            content: 'Conteúdo do post 1',
        },
        {
            userId: 2,
            title: 'post 2',
            content: 'Conteúdo do post 2',
          },        
      ];
      
      beforeAll(async () => {
        await models.sequelize.sync({ force: true });
        await models.User.bulkCreate(users);
        await models.Post.bulkCreate(posts);
      });
    
    describe('get post', () => {
        it('should get all posts', async () => {
            const response = await request(app)
                .get('/api/posts/');
            expect(response.statusCode).toEqual(200);
            const titles = response.body.posts.map(post => post.title);
            expect(titles).toContain(posts[1].title);
            expect(response.body.posts.length).toBeGreaterThan(1);
        });
    
        it('should get a single post', async () => {
            const postId = 2;
            const response = await request(app)
                .get(`/api/posts/${postId}`);
            expect(response.statusCode).toEqual(200);
            expect(response.body.post).toMatchObject({
                content: posts[1].content
            });
        });
    
        it('should not get post that does not exist', async () => {
            const postId = -1;
            const response = await request(app).get(`/api/posts/${postId}`);
            expect(response.statusCode).toEqual(404);
            expect(response.body).not.toHaveProperty('post');
            expect(response.body.error).toEqual('Post with the specified ID does not exists');
        });
    
        it('should not get invalid parameter', async () => {
            let errorMessage;
            const originalGetPostById = controller.getPostById;
    
            controller.getPostById = async (id) => {
                try {
                  await originalGetPostById(id);
                } catch (error) {
                  errorMessage = error.message;
                  throw error;            
                }
                const postId = 'abcd';
                const response = await request(app).get(`/api/posts/${postId}`);
                expect(response.statusCode).toEqual(500);
                expect(response.body).not.toHaveProperty('post');
                expect(response.body.error).toEqual(errorMessage);
    
                controller.getPostById = originalGetPostById;
            };
        });
    });
    describe('update post', () => {
        it('should update an existing post', async () => {
            const postId = 1;
            const newTitle = 'new title'
            const response = await request(app)
                .put(`/api/posts/${postId}`)
                .send({
                    title: newTitle
                });
            expect(response.statusCode).toEqual(200);
            expect(response.body.post.title).not.toEqual(posts[0].title);
            expect(response.body.post.title).toEqual(newTitle);
        });
    });
    describe('delete post', () => {
        it('should delete a post', async () => {
            const postId = 1;
            const response = await request(app)
                .delete(`/api/posts/${postId}`);
            expect(response.statusCode).toEqual(204)
        })
    })
});