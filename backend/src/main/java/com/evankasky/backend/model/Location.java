package com.evankasky.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class Location {

    @Column(name = "location_x", nullable = false)
    int x;

    @Column(name = "location_y", nullable = false)
    int y;

    /* *****************************************************************************************************************
     *                                              Constructors
     ***************************************************************************************************************** */

    protected Location() { }

    public Location(int x, int y) {
        this.x = x;
        this.y = y;
    }

    /* *****************************************************************************************************************
    *                                               Getters and Setters
    ***************************************************************************************************************** */

    public void setX(int x) {
        this.x = x;
    }

    public int getX() {
        return x;
    }

    public void setY(int y) {
        this.y = y;
    }

    public int getY() {
        return y;
    }
}
