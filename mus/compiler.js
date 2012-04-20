var endTime = function (time, expr) {
    if (expr.tag === 'note')
        return time+expr.dur;
    else if (expr.tag === 'seq')
        return endTime(endTime(time, expr.right), expr.left);
    else if (expr.tag === 'rest')
        return time+expr.duration; 
    else if (expr.tag === 'repeat')
        return time+expr.count*endTime(0, expr.section);
    else  // 'par'
    {
        var leftTime = endTime(time, expr.left);
        var rightTime = endTime(time, expr.right);
        return (leftTime > rightTime) ? leftTime: rightTime;
    }
};

var convertPitch = function(pitch)
{
    var octave = Number(pitch[1]);
    var letterPitch;

    switch(pitch[0].toLowerCase())
    {
        case 'a':
            letterPitch = 9;
            break;
        case 'b':
            letterPitch = 11;
            break;
        case 'c':
            letterPitch = 0;
            break;
        case 'd':
            letterPitch = 2;
            break;
        case 'e':
            letterPitch = 4;
            break;
        case 'f':
            letterPitch = 5;
            break;
        default: // g
            letterPitch = 7;
            break;
    }

    return 12 + 12 * octave + letterPitch;
};

var compileT = function (time, token, output) {
    if (token.tag === 'note')
    {
        output.push({tag: 'note', pitch: convertPitch(token.pitch), start: time, dur: token.dur});
        
        return time + token.dur;
    }
    else if (token.tag === 'seq')
        return compileT(compileT(time, token.left, output), token.right, output);
    else if (token.tag === 'rest')
    {
        token.start = time;
        output.push({tag: 'rest', start: time, duration: token.duration});
        
        return time + token.duration;
    }
    else if (token.tag === 'repeat')
    {
        
        var tmps = time;

        for(i = 0; i < token.count; i++)
        {
            tmps = compileT(tmps, token.section, output);
        }
        
        return tmps;
    }    
    else // deal with 'par' tag
    {    
        var leftTime  = compileT(time, token.left, output);
        var rightTime = compileT(time, token.right, output);    
    
        return (rightTime > leftTime)?rightTime:leftTime;
    }    
};

var compile = function (musexpr) {
    // your code here
    var output = [];
    
    compileT(0, musexpr, output);
    
    return output;

};

var melody_mus = 
    { tag: 'seq',
      left: 
       { tag: 'seq',
         left: { tag: 'note', pitch: 'a4', dur: 250 },
         right: { tag: 'note', pitch: 'b4', dur: 250 } },
      right:
       { tag: 'seq',
         left: { tag: 'note', pitch: 'c4', dur: 500 },
         right: { tag: 'note', pitch: 'd4', dur: 500 } } };

var melody_par = /* to test endTime function */
    { tag: 'par',
      left: { tag: 'note', pitch: 'c4', dur: 250 },
      right:
       { tag: 'par',
         left: { tag: 'note', pitch: 'e4', dur: 350 },
         right: { tag: 'note', pitch: 'g4', dur: 250 } } }

var melody_repeat =
     { tag: 'seq',
      left: 
       { tag: 'seq',
         left: { tag: 'note', pitch: 'a4', dur: 250 },
         right: { tag: 'note', pitch: 'b4', dur: 250 } },
      right:
       { tag: 'seq',
         left: { tag: 'note', pitch: 'c4', dur: 500 },
         right: 
          { tag: 'seq',
            left: { tag: 'note', pitch: 'd4', dur: 500 },
            right: { tag: 'repeat', 
                     section: { tag: 'seq',
                                left: 
                                 { tag: 'seq',
                                   left: { tag: 'note', pitch: 'e4', dur: 250 },
                                   right: { tag: 'note', pitch: 'f4', dur: 250 } },
                                right:
                                 { tag: 'seq',
                                   left: { tag: 'note', pitch: 'g4', dur: 500 },
                                   right: { tag: 'note', pitch: 'a4', dur: 500 } } },
                     count: 4}} } };

//console.log(melody_mus);
//console.log(compile(melody_mus));

//console.log("\n\nMe next!\n\n");
//console.log(melody_par);
//console.log(endTime(0, melody_par));

//console.log("\n\nPitch to note\n\n");
//console.log(convertPitch('g2'));

//console.log(compile(melody_repeat));
h = compile(melody_repeat);
for (i in h) console.log(h[i]);
