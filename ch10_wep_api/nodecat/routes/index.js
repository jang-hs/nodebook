const express = require('express');
const axios = require('axios');

const router = express.Router();
const URL = 'http://localhost:8002/v1';

axios.defaults.headers.origin = 'http://localhost:4000'; // origin 헤더
const request = async (req, api) => {
    try {
        // 세션에 토큰이 없으면
        if (!req.session.jwt) {
            const tokenResult = await axios.post(`${URL}/token`, {
                clientSecret: process.env.CLIENT_SECRET,
            });
            // 세션에 토큰 저장
            req.session.jwt = tokenResult.data.token;
        }
        // API 요청
        return await axios.get(`${URL}${api}`, {
            headers: { authorization: req.session.jwt },
        });
    } catch (error) {
        // 토큰 만료시 재발급
        if (error.response.status === 419) {
            delete req.session.jwt;
            return request(req, api);
        } // 419 외의 에러는
        return error.response;
    }
};

router.get('/mypost', async (req, res, next) => {
    try {
        const result = await request(req, '/posts/my');
        res.json(result.data);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.get('/search/:hashtag', async (req, res, next) => {
    try {
        const result = await request(
            req, `/posts/hashtag/${encodeURIComponent(req.params.hashtag)}`,
        );
        res.json(result.data);
    } catch (error) {
        if (error.code) {
            console.error(error);
            next(error);
        }
    }
});



module.exports = router;