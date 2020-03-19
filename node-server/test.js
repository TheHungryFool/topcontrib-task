process.env.NODE_ENV = "test";

let chai      = require('chai');
let chaiHttp  = require('chai-http');
let app       = require('./app');
let should    = chai.should();
let constants = require('./constants');
let config    = require('./config');

chai.use(chaiHttp);

describe("TopContrib", () => {
    // beforeEach((done) => {});
    let validateErrorResponse = (res, httpStatus, topcontribError) => {
        res.should.have.status(httpStatus);
        res.body.data.message.should.be.a('string');
        res.body.error.should.be.a('number').eql(topcontribError);
    };

    describe("/GET /toprepos/:organization", () => {
        it("should return top n repositories (or max repos) of the organization for valid request", (done) => {
            let n                = 3;
            let organization     = "google";
            let validateResponse = (res) => {
                res.should.have.status(200);
                res.body.data.repositories.should.be.a('array');
                res.body.data.repositories[0].should.have.property("forks_count");
                res.body.data.repositories[0].should.have.property("name");
                res.body.data.repositories.length.should.be.at.most(n); // the organization might not have n repos, so at most n
                res.body.error.should.be.a('number');
            };


            // without github token
            chai.request(app)
                .get("/toprepos/" + organization + "?n=" + n)
                .set(constants.CLIENT_TOKEN_KEY, config.clientToken)
                .end((err, res) => {
                    validateResponse(res);
                });

            // with github token
            chai.request(app)
                .get("/toprepos/" + organization + "?n=" + n)
                .set(constants.CLIENT_TOKEN_KEY, config.clientToken)
                .set(constants.GITHUB_TOKEN_KEY, config.githubToken)
                .end((err, res) => {
                    validateResponse(res);

                    done();
                });
        });

        it("should send http 404 and topcontrib error 5004 if the organization does not exist", (done) => {
            let n            = 3;
            let organization = "doiwjoedjw";

            chai.request(app)
                .get("/toprepos/" + organization + "?n=" + n)
                .set(constants.CLIENT_TOKEN_KEY, config.clientToken)
                .end((err, res) => {
                    validateErrorResponse(res, 404, 5004);

                    done();
                });
        });

        it("should send http 401 and topcontrib error 5001 if the client token or github token is invalid", (done) => {
            let n            = 3;
            let organization = "google";

            // invalid client token
            chai.request(app)
                .get("/toprepos/" + organization + "?n=" + n)
                .set(constants.CLIENT_TOKEN_KEY, "someinvalidtoken")
                .end((err, res) => {
                    validateErrorResponse(res, 401, 5001);
                });

            // invalid github token
            chai.request(app)
                .get("/toprepos/" + organization + "?n=" + n)
                .set(constants.CLIENT_TOKEN_KEY, config.clientToken)
                .set(constants.GITHUB_TOKEN_KEY, "24femrkfekfrn")
                .end((err, res) => {
                    validateErrorResponse(res, 401, 5001);

                    done();
                });
        });

        it("should send http 400 and topcontrib error 5006 if the query param (n) is missing or malformed", (done) => {
            let n            = "abc";
            let organization = "google";

            // missing
            chai.request(app)
                .get("/toprepos/" + organization)
                .set(constants.CLIENT_TOKEN_KEY, config.clientToken)
                .end((err, res) => {
                    validateErrorResponse(res, 400, 5006);
                });

            // malformed
            chai.request(app)
                .get("/toprepos/" + organization + "?n=" + n)
                .set(constants.CLIENT_TOKEN_KEY, config.clientToken)
                .end((err, res) => {
                    validateErrorResponse(res, 400, 5006);

                    done();
                });
        });
    });

    describe("/GET /topcontributors/:organization/:repository", () => {
        it("should return top m contributors (or max) for the repo of the organization for valid request", (done) => {
            let m                = 4;
            let organization     = "google";
            let repository       = "styleguide";
            let validateResponse = (res) => {
                res.should.have.status(200);
                res.body.data.contributors.should.be.a("array");
                res.body.data.contributors.length.should.be.at.most(m);
                res.body.data.contributors[0].should.have.property("login");
                res.body.data.contributors[0].should.have.property("contributions");
                res.body.data.contributors[0].should.have.property("id");
                res.body.error.should.be.a('number');
            };


            // without github token
            chai.request(app)
                .get("/topcontributors/" + organization + "/" + repository + "?m=" + m)
                .set(constants.CLIENT_TOKEN_KEY, config.clientToken)
                .end((err, res) => {
                    validateResponse(res);
                });

            // with github token
            chai.request(app)
                .get("/topcontributors/" + organization + "/" + repository + "?m=" + m)
                .set(constants.CLIENT_TOKEN_KEY, config.clientToken)
                .set(constants.GITHUB_TOKEN_KEY, config.githubToken)
                .end((err, res) => {
                    validateResponse(res);

                    done();
                });
        });

        it("should send http 404 and topcontrib error 5004 if the organization does not exist", (done) => {
            let m            = 4;
            let organization = "owjdiwejodwd";
            let repository   = "styleguide";

            chai.request(app)
                .get("/topcontributors/" + organization + "/" + repository + "?m=" + m)
                .set(constants.CLIENT_TOKEN_KEY, config.clientToken)
                .end((err, res) => {
                    validateErrorResponse(res, 404, 5004);

                    done();
                });
        });

        it("should send http 404 and topcontrib error 5004 if the repository does not exist", (done) => {
            let m            = 4;
            let organization = "google";
            let repository   = "stylegweodiwwdoeowewdeoiuide";

            chai.request(app)
                .get("/topcontributors/" + organization + "/" + repository + "?m=" + m)
                .set(constants.CLIENT_TOKEN_KEY, config.clientToken)
                .end((err, res) => {
                    validateErrorResponse(res, 404, 5004);

                    done();
                });
        });

        it("should send http 401 and topcontrib error 5001 if the client token or github token is invalid", (done) => {
            let m            = 4;
            let organization = "google";
            let repository   = "styleguide";

            // invalid client token
            chai.request(app)
                .get("/topcontributors/" + organization + "/" + repository + "?m=" + m)
                .set(constants.CLIENT_TOKEN_KEY, "someinvalidtoken")
                .end((err, res) => {
                    validateErrorResponse(res, 401, 5001);
                });

            // invalid github token
            chai.request(app)
                .get("/topcontributors/" + organization + "/" + repository + "?m=" + m)
                .set(constants.CLIENT_TOKEN_KEY, config.clientToken)
                .set(constants.GITHUB_TOKEN_KEY, "24femrkfekfrn")
                .end((err, res) => {
                    validateErrorResponse(res, 401, 5001);

                    done();
                });
        });

        it("should send http 400 and topcontrib error 5006 if the query param (m) is missing or malformed", (done) => {
            let m            = "doiwde";
            let organization = "google";
            let repository   = "styleguide";

            // missing
            chai.request(app)
                .get("/topcontributors/" + organization + "/" + repository)
                .set(constants.CLIENT_TOKEN_KEY, config.clientToken)
                .end((err, res) => {
                    validateErrorResponse(res, 400, 5006);
                });

            // malformed
            chai.request(app)
                .get("/topcontributors/" + organization + "/" + repository + "?m=" + m)
                .set(constants.CLIENT_TOKEN_KEY, config.clientToken)
                .end((err, res) => {
                    validateErrorResponse(res, 400, 5006);

                    done();
                });
        });
    });

    describe("/POST /PUT /PATCH /DELETE /toprepos/:organization", () => {
        it("should send http 405 and topcontrib error 5008 since the methods are not supported", (done) => {
            let n            = 3;
            let organization = "google";

            chai.request(app)
                .post("/toprepos/" + organization + "?n=" + n)
                .set(constants.CLIENT_TOKEN_KEY, config.clientToken)
                .end((err, res) => {
                    validateErrorResponse(res, 405, 5008);
                });

            chai.request(app)
                .put("/toprepos/" + organization + "?n=" + n)
                .set(constants.CLIENT_TOKEN_KEY, config.clientToken)
                .end((err, res) => {
                    validateErrorResponse(res, 405, 5008);
                });

            chai.request(app)
                .patch("/toprepos/" + organization + "?n=" + n)
                .set(constants.CLIENT_TOKEN_KEY, config.clientToken)
                .end((err, res) => {
                    validateErrorResponse(res, 405, 5008);
                });

            chai.request(app)
                .delete("/toprepos/" + organization + "?n=" + n)
                .set(constants.CLIENT_TOKEN_KEY, config.clientToken)
                .end((err, res) => {
                    validateErrorResponse(res, 405, 5008);
                });

            done();
        });
    });

    describe("/POST /PUT /PATCH /DELETE /topcontributors/:organization/:repository", () => {
        it("should send http 405 and topcontrib error 5008 since the methods are not supported", (done) => {
            let m            = 3;
            let organization = "google";
            let repository   = "styleguide";

            chai.request(app)
                .post("/topcontributors/" + organization + "/" + repository + "?m=" + m)
                .set(constants.CLIENT_TOKEN_KEY, config.clientToken)
                .end((err, res) => {
                    validateErrorResponse(res, 405, 5008);
                });

            chai.request(app)
                .put("/topcontributors/" + organization + "/" + repository + "?m=" + m)
                .set(constants.CLIENT_TOKEN_KEY, config.clientToken)
                .end((err, res) => {
                    validateErrorResponse(res, 405, 5008);
                });

            chai.request(app)
                .patch("/topcontributors/" + organization + "/" + repository + "?m=" + m)
                .set(constants.CLIENT_TOKEN_KEY, config.clientToken)
                .end((err, res) => {
                    validateErrorResponse(res, 405, 5008);
                });

            chai.request(app)
                .delete("/topcontributors/" + organization + "/" + repository + "?m=" + m)
                .set(constants.CLIENT_TOKEN_KEY, config.clientToken)
                .end((err, res) => {
                    validateErrorResponse(res, 405, 5008);
                });

            done();
        });
    });

    describe("/GET /POST /PUT /PATCH /DELETE /some/invalidendpoint", () => {
        it("should send http 404 and topcontrib error 5004 since the requested resource does not exist", (done) => {
            chai.request(app)
                .post("/some/invalidendpoints")
                .set(constants.CLIENT_TOKEN_KEY, config.clientToken)
                .end((err, res) => {
                    validateErrorResponse(res, 404, 5004);
                });

            chai.request(app)
                .put("/some/invalidendpoints")
                .set(constants.CLIENT_TOKEN_KEY, config.clientToken)
                .end((err, res) => {
                    validateErrorResponse(res, 404, 5004);
                });

            chai.request(app)
                .patch("/some/invalidendpoints")
                .set(constants.CLIENT_TOKEN_KEY, config.clientToken)
                .end((err, res) => {
                    validateErrorResponse(res, 404, 5004);
                });

            chai.request(app)
                .delete("/some/invalidendpoints")
                .set(constants.CLIENT_TOKEN_KEY, config.clientToken)
                .end((err, res) => {
                    validateErrorResponse(res, 404, 5004);
                });

            done();
        });
    });
});
