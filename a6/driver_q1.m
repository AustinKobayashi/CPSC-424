%
% CPSC 424 Assignment 5 Question 1
%
% Script that tests the subdivide function.
%
% Your task for this question is to implement subdivide().
%

% ====================================================
%                Polygon 1
% ====================================================

% ================= set the control points
x1 = [0 1 3 3];
y1 = [0 2 3 1];

figure(1);

%===================  Draw scheme 1

subplot(4,2,1);
plot(x1,y1,'.k');
patch(x1,y1,'g');
title('Cubic');


[x,y] = subdivide(x1, y1, 0, 1, 0);
subplot(4,2,3);
plot(x,y,'.k');
patch(x,y,'g');
title('k = 0');


[x,y] = subdivide(x1, y1, 1, 1, 0);
subplot(4,2,5);
plot(x,y,'.k');
patch(x,y,'g');
title('k = 1');


[x,y] = subdivide(x1, y1, 5, 1, 0);
subplot(4,2,7);
plot(x,y,'.k');
patch(x,y,'g');
title('k = 5');

%===================  Draw scheme 2

subplot(4,2,2);
plot(x1,y1,'.k');
patch(x1,y1,'g');
title('1/7 5/7 1/7');


[x,y] = subdivide(x1, y1, 0, 2, 0);
subplot(4,2,4);
plot(x,y,'.k');
patch(x,y,'g');


[x,y] = subdivide(x1, y1, 1, 2, 0);
subplot(4,2,6);
plot(x,y,'.k');
patch(x,y,'g');


[x,y] = subdivide(x1, y1, 5, 2, 0);
subplot(4,2,8);
plot(x,y,'.k');
patch(x,y,'g');


% ====================================================
%                Polygon 2
% ====================================================


x2 = [0 1 3 2 4 3 2];
y2 = [0 3 2 4 3 0 1];

figure(2);

subplot(4,2,1);
plot(x2,y2,'.k');
patch(x2,y2,'g');
title('Cubic');
% 
% %===================  Draw scheme 1

[x,y] = subdivide(x2, y2, 0, 1, 0);
subplot(4,2,3);
plot(x,y,'.k');
patch(x,y,'g');
title('k = 0');

[x,y] = subdivide(x2, y2, 1, 1, 0);
subplot(4,2,5);
plot(x,y,'.k');
patch(x,y,'g');
title('k = 1');

[x,y] = subdivide(x2, y2, 5, 1, 0);
subplot(4,2,7);
plot(x,y,'.k');
patch(x,y,'g');
title('k = 5');

%===================  Draw scheme 2

subplot(4,2,2);
plot(x2,y2,'.k');
patch(x2,y2,'g');
title('1/7 5/7 1/7');

[x,y] = subdivide(x2, y2, 0, 2, 0);
subplot(4,2,4);
plot(x,y,'.k');
patch(x,y,'g');

[x,y] = subdivide(x2, y2, 1, 2, 0);
subplot(4,2,6);
plot(x,y,'.k');
patch(x,y,'g');

[x,y] = subdivide(x2, y2, 5, 2, 0);
subplot(4,2,8);
plot(x,y,'.k');
patch(x,y,'g');
