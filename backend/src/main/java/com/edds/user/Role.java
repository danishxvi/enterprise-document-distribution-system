package com.edds.user;

/**
 * The two access levels the portal understands. Admins may publish and retire
 * documents; employees may only read. Stored as a string in the database so
 * the values stay readable and reordering never breaks existing rows.
 */
public enum Role {
    ADMIN,
    EMPLOYEE
}
