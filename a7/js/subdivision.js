function subdivider (input_mesh) {
    this.meshes = [];
    
    // Initializes this subdivision object with a mesh to use as 
    // the control mesh (ie: subdivision level 0).
    this.meshes.push(input_mesh);

    this.subdivide = function (level) {
        // Subdivides the control mesh to the given subdivision level.
        // Returns the subdivided mesh.

        // HINT: Create a new subdivision mesh for each subdivision level and
        // store it in memory for later.
        // If the calling code asks for a level that has already been computed,
        // just return the pre-computed mesh!

        if (this.meshes.length > level)
            return this.meshes[level];

        for (let i = this.meshes.length - 1; i < level; i++) {
            let working_mesh = new Mesh();
            working_mesh.copyMesh(this.meshes[i]);

            working_mesh.getVertices().forEach(vertex => {
                vertex.setNew(false);
            });
            working_mesh.getEdges().forEach(half_edge => {
                half_edge.setIsSplit(false);
            });

            working_mesh.set_edge_count();
            working_mesh.set_face_count();

            let he = working_mesh.get_unsplit_edge();
            while (he) {
                this.split_edge(he, working_mesh);
                he = working_mesh.get_unsplit_edge();
            }

            let f = working_mesh.get_non_triangle_face();
            while (f) {
                this.cut_a_corner(f, working_mesh);
                f = working_mesh.get_non_triangle_face();
            }

            working_mesh.getVertices().forEach(vertex => {
                if (vertex.isNew()) {
                    let pos = this.butterfly(vertex, working_mesh);
                    vertex.setPos(pos[0], pos[1], pos[2]);
                }
            });

            working_mesh.computeNormal();
            this.meshes.push(working_mesh);
        }

        return this.meshes[level];
    };


    this.split_edge = function (half_edge, mesh) {
        half_edge.setIsSplit(true);
        half_edge.getTwin().setIsSplit(true);

        let start = half_edge.getOrigin();
        let end = half_edge.getNext().getOrigin();

        let new_vertex_pos = start.getPos().add(end.getPos()).multiply(1/2);

        let new_vertex = mesh.addVertexPos(new_vertex_pos.x(), new_vertex_pos.y(), new_vertex_pos.z(), mesh.getVertices().length);

        new_vertex.setNew(true);

        let he = mesh.addEdge(new_vertex, end);
        let he_twin = mesh.updateEdgeEnd(end, start, new_vertex);
        let he_prev = mesh.updateEdgeEnd(start, end, new_vertex);
        let he_prev_twin = mesh.addEdge(new_vertex, start);

        he.setNext(he_prev.getNext());
        he.getNext().setPrev(he);

        he.setPrev(he_prev);
        he_prev.setNext(he);

        he_prev_twin.setNext(he_twin.getNext());
        he_prev_twin.getNext().setPrev(he_prev_twin);

        he_twin.setNext(he_prev_twin);
        he_prev_twin.setPrev(he_twin);

        he.setIsSplit(true);
        he_twin.setIsSplit(true);
        he_prev.setIsSplit(true);
        he_prev_twin.setIsSplit(true);
    };

    this.cut_a_corner = function (face, mesh) {
        let face_edge = face.getEdge();

        let v1 = face_edge.getPrev().getOrigin();
        let v2 = face_edge.getOrigin();
        let v3 = face_edge.getNext().getOrigin();

        let he = mesh.addEdge(v3, v1);
        let he_twin = mesh.addEdge(v1, v3);

        he.setIsSplit(true);
        he_twin.setIsSplit(true);

        he_twin.setPrev(face_edge.getPrev().getPrev());
        he_twin.getPrev().setNext(he_twin);

        he_twin.setNext(face_edge.getNext());
        he_twin.getNext().setPrev(he_twin);

        he.setNext(face_edge.getPrev());
        he.getNext().setPrev(he);

        he.setPrev(face_edge);
        face_edge.setNext(he);

        let new_face = mesh.addFaceByVerts(v1, v2, v3);

        face.setEdge(he_twin.getPrev());
        he_twin.setFace(face);

        face_edge.setFace(new_face);
        face_edge.getNext().setFace(new_face);
        face_edge.getPrev().setFace(new_face);
    };

    this.butterfly = function (vertex, mesh) {
        let end = this.get_end_vertice(vertex);

        let he = mesh.findEdge(vertex, end);

        let left = he.getNext().getOrigin();
        let right = he.getPrev().getTwin().getPrev().getTwin().getPrev().getOrigin();
        let top_left = he.getTwin().getPrev().getTwin().getPrev().getPrev().getTwin().getPrev().getTwin().getPrev().getOrigin();
        let bottom_left = he.getNext().getTwin().getPrev().getTwin().getNext().getTwin().getPrev().getOrigin();
        let top = he.getTwin().getNext().getTwin().getPrev().getTwin().getPrev().getOrigin();
        let bottom = he.getPrev().getTwin().getNext().getTwin().getPrev().getOrigin();
        let bottom_right = he.getPrev().getTwin().getNext().getTwin().getPrev().getTwin().getPrev().getTwin().getNext().getTwin().getPrev().getOrigin();
        let top_right = he.getTwin().getNext().getTwin().getNext().getTwin().getPrev().getTwin().getPrev().getTwin().getNext().getTwin().getPrev().getOrigin();

        let x = left.getPos().x() * (8/16) + right.getPos().x() * (8/16) + top_left.getPos().x() * (-1/16) +
            bottom_left.getPos().x() * (-1/16) + top.getPos().x() * (2/16) + bottom.getPos().x() * (2/16) +
            bottom_right.getPos().x() * (-1/16) + top_right.getPos().x() * (-1/16);

        let y = left.getPos().y() * (8/16) + right.getPos().y() * (8/16) + top_left.getPos().y() * (-1/16) +
            bottom_left.getPos().y() * (-1/16) + top.getPos().y() * (2/16) + bottom.getPos().y() * (2/16) +
            bottom_right.getPos().y() * (-1/16) + top_right.getPos().y() * (-1/16);

        let z = left.getPos().z() * (8/16) + right.getPos().z() * (8/16) + top_left.getPos().z() * (-1/16) +
            bottom_left.getPos().z() * (-1/16) + top.getPos().z() * (2/16) + bottom.getPos().z() * (2/16) +
            bottom_right.getPos().z() * (-1/16) + top_right.getPos().z() * (-1/16);

        return [x, y, z];
    };



    this.get_end_vertice = function (vertex) {
        let start_he = vertex.getEdge();

        let cur_edge = undefined;
        let next = start_he;

        while (cur_edge !== start_he) {
            for (let i = 0; i < 2; i++) {
                if (!next.getOrigin().isNew()) {
                    return next.getOrigin();
                }
                next = next.getNext();
            }
            next = next.getTwin();
            cur_edge = next;
        }

        return undefined;
    };

    this.clear = function () {
        this.meshes = [];
    };
}