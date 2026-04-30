package com.mihnea.restapi.Exceptions;

public class ResourceAlreadyExistsException extends RuntimeException{
    public ResourceAlreadyExistsException(String message) { super(message); }
}
