package com.edds.document;

/**
 * The three kinds of document the portal distributes. They share the same
 * metadata, which is exactly why a single documents table with this enum beats
 * three near identical tables.
 */
public enum DocType {
    CIRCULAR,
    ORDER,
    NOTIFICATION
}
