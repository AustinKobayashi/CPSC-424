function draw_curve_2D(pos, c, v, displace)
% function draw_curve_2D(pos, c, v, displace)
%
% Draws a curve formed by the specified points x. Optionally, colors
% the line according to the scalars c. Also, it can draw normals or
% tangents specified on the curve as the vectors v.
%
% pos: n x 2 vector specifying sampling points on the curve
% c(optional): n x 1  vector for scalars to be used as colors on
% curve.
% v(optional): n x 2 vector specifying the normals or tangents.
% displace(optional between 0 and 1): if nonzero, the vectors v are
% displaced slightly for visualization purposes.


% No arguments, run test code.
if (nargin ==0) run_min_example(); return; end

% Not enough arguments, use defaults.
if (nargin < 4) displace = 0; end
if (nargin < 3) v = []; end
if (nargin < 2) c = []; end

hold on;
handle = [];

% Only draw the curve
if( isempty(c) )
    handle = plot(pos(:,1),pos(:,2), '-','linewidth',3,'color','b');
% Draw colors too.
else
    % plot the line as a surface
    z = zeros(size(pos, 1), 1);
    c = reshape(c, [], 1);

    handle = surface([pos(:,1), pos(:,1)], [pos(:,2), pos(:,2)], [z, z], ...
        [c, c], ... % Colour vector
        'EdgeColor', 'flat', ... % Shade edges using colour vector
        'FaceColor', 'none', ...  % Don't colour faces
        'linewidth', 2.5);
    colorbar(gca())
end

% Draw vectors
if( ~isempty(v) )

    nvectorstodraw= 15;
    stride = max(idivide(uint32(size(v,1)), uint32(nvectorstodraw)), 1);

    for i=1:stride:size(v,1)
        r = null(v(i,:));
        r=r/norm(r,2);
        reshape(r,1,[]);
        delta = norm(v(i,:),2)*displace*reshape(r,1,[]);
        p = pos(i,:) + delta;
        handle = quiver(p(1),p(2),v(i,1),v(i,2),0, 'MaxHeadSize',2, 'linewidth', 1);
        handle.Color=[1,0,0,0.8];
    end
end

end


% Test code
function run_min_example()
  x = [1 2 3 4 5 6];
  y = x.*x;
  x = [x;y]';
  subplot(1,3,1)
  draw_curve_2D(x);

  c = reshape([6 5 4 3 2 1], [], 1);
  subplot(1,3,2);
  draw_curve_2D(x,c);

  subplot(1,3,3);
  v = [1 1 1 1 1 1; -1 -1 -1 -1 -1 -1]';
  draw_curve_2D(x,c,v*0.5);
end
