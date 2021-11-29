const path = require('path');
const db = require('../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");
const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;


const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', {movies})
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', {movie});
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            });
    },
    
    add: async function (req, res) {
        const locals = {
            allGenres: await db.Genre.findAll()
        }
        res.render('moviesAdd', locals)
    },
    create: function (req,res) {
        db.Movie.create({
            title: req.body.title,
            rating: req.body.rating,
            awards: req.body.awards,
            release_date: req.body.release_date,
            length: req.body.length,
            genre_id: req.body.genre_id,
        })

        res.redirect('/movies/add');
    },
    edit: async function(req,res) {
        const locals = {
            Movie: await db.Movie.findByPk(req.params.id, {
                include: ['genre']
            }),
            allGenres: await db.Genre.findAll()
        }
        res.render('moviesEdit', locals)
    },
    update: function (req,res) {
        db.Movie.update({
            title: req.body.title,
            rating: req.body.rating,
            awards: req.body.awards,
            release_date: req.body.release_date,
            length: req.body.length,
            genre_id: req.body.genre_id,
        },{
            where: {id: req.params.id}
        })
        res.redirect(`/movies/detail/${req.params.id}`)
    },
    delete: function (req,res) {

    },
    destroy: function (req,res) {
        db.Movie.destroy({
            where: {id: req.params.id}
        })
        res.redirect('/movies')
    }

    
}

module.exports = moviesController;