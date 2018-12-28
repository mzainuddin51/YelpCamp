var express         = require("express"),
    app             = express(),
    User            = require("./models/user"),
    flash           =require("connect-flash"),
    seedDB          = require("./seeds"),
    Comment         = require("./models/comment"),
    passport        = require("passport"),
    mongoose        = require("mongoose"),
    bodyParser      = require("body-parser"),
    Campground      = require("./models/campground"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override");
    
var authRoutes       = require("./routes/auth"),
    commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds");

//To make sure that we have a backup url just in case something goes wrong
var url=process.env.DATABASEURL || "mongodb://localhost:27017/yelp_camp";
    
mongoose.connect(url,{useNewUrlParser:true });
//LOCAL DB
// mongoose.connect("mongodb://localhost:27017/yelp_camp",{useNewUrlParser:true });

//HEROKU DB
//mongodb://zain:zain123@ds145194.mlab.com:45194/yelp_camp
//seedDB();

app.set("view engine","ejs");

app.use(require("express-session")({
    secret:"Rusty is the cutest dog in the world",
    resave:false,
    saveUninitialized:false
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));


app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
});

app.use("/",authRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);


app.listen(process.env.PORT,process.env.IP,function(){
    console.log("The YelpCamp Server has Started!!!");
});