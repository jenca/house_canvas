var color = function(r, g, b, a){
    if(a !== undefined){
        return "rgba(" + r + "," + g + "," + b + "," + a + ")";
    } else {
        return "rgb(" + r + "," + g + "," + b + ")";
    };
};

var DRAW_DELAY = 50;
var CLEAR_COLOR = color(0, 0, 0, 0);
var STARS = 100;

var make_interp = function(start, end){
    return function(i){
        return Math.floor(start + ((end - start)*i));
    };
};

var DayCycle = function(canvas, duration, update_delay, colors){
    this.canvas = canvas;
    this.duration = duration;
    this.update_delay = update_delay;
    this.colors = colors;
    this.color_time = duration / colors.length;
    this.interp = 0;
    this.interp_d = 1 / (this.color_time / this.update_delay);
    this.create_interps();
    this.stars = this.generate_stars();
    setInterval(this.update.bind(this), this.update_delay);
};

DayCycle.prototype.draw = function(ctx){
    var color_string = this.get_color();
    set_fill(ctx, color_string);
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    for(var i = 0; i < this.stars.length; i++){
        this.stars[i].draw(ctx);
    };
};

DayCycle.prototype.update = function(){
    this.interp = this.interp_d + this.interp;
    console.log("interp value is:" + this.interp)
    if(this.interp >= 1){
        this.interp = 0;
        var color_value = this.colors.shift();
        this.colors.push(color_value);
        this.create_interps();
    };
};

DayCycle.prototype.generate_stars = function(){
    var star_array = []
    for(var i = 0; i < STARS; i++){
        var star = new Star(this.canvas);
        star_array.push(star);
    };
    return star_array;
};

DayCycle.prototype.create_interps = function() {
    // get current left-color
    var first_color = this.colors[0];
    // get current right-color
    var next_color = this.colors[1];
    // make interp function for each color component
    var r_interp = make_interp(first_color[0], next_color[0]);
    var g_interp = make_interp(first_color[1], next_color[1]);
    var b_interp = make_interp(first_color[2], next_color[2]);
    this.get_color = function() {
        return color(r_interp(this.interp), g_interp(this.interp), b_interp(this.interp));
    };
};

var Star = function(canvas){
    this.x = Math.floor(Math.random() * canvas.width+1);
    this.y = Math.floor(Math.random() * canvas.height+1);
    this.draw = function(ctx){
        ctx.fillStyle = "rgb(242, 221, 84)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, 1, 0, 2*Math.PI);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
    };
};

var Cloud = function(x, y, dx, dy, radius, stroke, fill){
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.width = this.radius*2 + this.radius*.75*2;
    this.stroke = stroke;
    this.fill = fill;
    this.draw = function(ctx){
        set_fill(ctx, this.stroke, this.fill);
        draw_circle(ctx, this.x-this.radius, this.y, this.radius*.75);
        draw_circle(ctx, this.x, this.y, this.radius);
        draw_circle(ctx, this.x+this.radius, this.y, this.radius*.75);

};

Cloud.prototype.move = function(canvas){
    this.x += this.dx;
    this.y += this.dy;
    if(this.x < -(this.width / 2)){
        this.x = canvas.width + (this.width/2);
    };
};

    setInterval(this.move.bind(this), 500);
};

var set_stroke = function(ctx, stroke, fill){
    ctx.strokeStyle = stroke;
    if(fill !== undefined){
        ctx.fillStyle = fill;
    } else {
        ctx.fillStyle = CLEAR_COLOR;
    };
};

var set_fill = function(ctx, fill, stroke){
    ctx.fillStyle = fill;
    if(stroke !== undefined){
        ctx.strokeStyle = stroke;
    } else {
        ctx.strokeStyle = CLEAR_COLOR;
    };
};

var draw_rect = function(ctx, x, y, width, height){
    ctx.strokeRect(x, y, width, height);
    ctx.fillRect(x, y, width, height);
};

var draw_circle = function(ctx, x, y, radius){
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2*Math.PI);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
};

var draw_tri = function(ctx, x, y, size){
    ctx.beginPath();
    ctx.moveTo(x, y - size);
    ctx.lineTo(x + size, y);
    ctx.lineTo(x - size, y);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
};

/*  jQuery ready function. Specify a function to execute when the DOM is fully loaded.  */
$(document).ready(function () {
    var canvas = document.getElementById('house');
    if (canvas.getContext){
      var ctx = canvas.getContext('2d');
    };

    //create things
    var day_cycle = new DayCycle(canvas, 30 * 1000, DRAW_DELAY, [[2, 1, 18], [56, 165, 249]]);
    var cloud = new Cloud(240, 30, -1, 0, 23, color(171, 204, 204), color(0, 0, 0, 0));

    var draw = function(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        //background
        day_cycle.draw(ctx);
        //housebody
        set_stroke(ctx, color(102, 45, 42), color(20, 6, 1));
        draw_rect(ctx, 100, 175, 100, 100);
        //door
        set_stroke(ctx, color(102, 45, 42), color(20, 6, 1));
        draw_rect(ctx, 135, 215, 30, 60);
        //doorknob
        set_stroke(ctx, color(102, 45, 42), color(20, 6, 1));
        draw_circle(ctx, 160, 245, 4);
        //roof
        set_stroke(ctx, color(102, 45, 42), color(20, 6, 1));
        draw_tri(ctx, 150, 175, 50);
        //grass
        set_stroke(ctx, color(17, 97, 17), color(1, 20, 1));
        draw_rect(ctx, 0, 275, 300, 30);
        //cloud
        cloud.draw(ctx);
        cloud.move(canvas);
    };

    setInterval(draw, DRAW_DELAY);    
});