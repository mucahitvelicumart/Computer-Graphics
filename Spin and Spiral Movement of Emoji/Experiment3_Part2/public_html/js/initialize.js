var radian = Math.PI / 180;
var scale = 0.43;
var face_radius = 0.50;  //Radius of face for drawing circle
var face_circle_center = [0.0, 0.0]; //Center of Face Circle

//Positions array of Yellow Face(Emoji)
var face_circle = [];
for (var j = 0; j < 360; j++){
    face_circle = face_circle.concat([face_radius * Math.cos(j * (radian)) + face_circle_center[0], face_radius * Math.sin(j * radian) + face_circle_center[1]]);
}

var eyes_radius = 0.075 ; //Radius of eyes for drawing circle
var eyes_circle_centers = [[0.15,0.175],[-0.15,0.175]];// Centers of Circles of Eyes

//Positions array of Eyes
var eyes_circles=[[],[]];
for(var i=0;i<2;i++){
    for (var j = 0; j < 360; j++){
        eyes_circles[i] = eyes_circles[i].concat([eyes_radius * Math.cos(j * radian) + eyes_circle_centers[i][0], eyes_radius * Math.sin(j * radian) + eyes_circle_centers[i][1]]);
    }
}

// Positions array for strings of mask( totally four strings)
var strings_of_mask = [
    [-0.50, 0.025,-0.30, -0.025,-0.50, -0.025,-0.30, -0.075],             //Left-Up String
    [0.50, 0.025,0.30, -0.025,0.50, -0.025,0.30, -0.075],                 //Right-Up String
    [-0.341, -0.365,-0.30, -0.35,-0.371, -0.335,-0.30, -0.31],            //Left-Down String
    [0.341, -0.365,0.30, -0.35,0.371, -0.335,0.30, -0.31]                 //Right-Down String
];

//Positions of Mask Square
var mask = [-0.30, -0.025,0.30, -0.025,-0.30, -0.35,0.30, -0.35];


//P0,P1,P2 are points for Bezier Curve Calculations
var p0 = {x:-0.30,y:-0.025}; 
var p1 = {x:0.0,y:0.125};
var p2 = {x:0.30,y:-0.025};

//Function of Bezier Curve
quadraticBezier= function(p0,p1,p2,t){
    var pFinal = {};
    pFinal.x = Math.pow(1-t,2)* p0.x +
               (1-t)*2*t*p1.x+
               t*t*p2.x;
    pFinal.y = Math.pow(1-t,2)* p0.y +
               (1-t)*2*t*p1.y+
               t*t*p2.y;
    return pFinal;
};

var curve_positions = [[],[]]; //Positions array of Curved Shape
//Calculation loop of points of Curved Shape for Mask
for(var t = 0 ; t < 1; t = t + 0.0005 ){
    var pFinal=quadraticBezier(p0,p1,p2,t);
    curve_positions[0] = curve_positions[0].concat([pFinal.x,pFinal.y]);
}


// Changing values of points for second Curved Shape
var p0_1 = {x:-0.30,y:-0.35}; 
var p1_1 = {x:0.0,y:-0.5};
var p2_1 = {x:0.30,y:-0.35};


// Calculation loop of points of Second Curved Shape for Mask
for(var t = 0 ; t < 1; t = t + 0.0005 ){
    var pFinal=quadraticBezier(p0_1,p1_1,p2_1,t);
    curve_positions[1] = curve_positions[1].concat([pFinal.x,pFinal.y]);
}


var color_mask=[0.839,0.878,0.922];    //Color data for mask
var color_black = [0.231,0.212,0.078]; //Color data for eyes
var color_yellow = [0.929,0.831,0.09]; //Color data for face

//Color array for Face
var face_color = []; 
for(var i = 0; i < 360; i++)
{ face_color = face_color.concat(color_yellow);}

//Color array for Eyes
var eyes_color = [];
for(var i = 0;i <360; i++){
    eyes_color = eyes_color.concat(color_black);
}

//Color array for Mask
var mask_color=[];
for(var i =0;i<4;i++){
    mask_color=mask_color.concat(color_mask);
}

//Color array for Strings of Mask
var strings_of_mask_color = [];
for (var i = 0; i < 4; i++)
{strings_of_mask_color = strings_of_mask_color.concat(color_mask);}

//Color array for Curved Shape
var curve_color=[];
for(var i = 0;i<2000;i++){
    curve_color=curve_color.concat(color_mask);
}



