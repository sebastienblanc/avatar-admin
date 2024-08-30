package org.sebi;

import java.io.File;

import org.eclipse.microprofile.rest.client.annotation.ClientHeaderParam;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;
import org.jboss.resteasy.reactive.RestForm;

import jakarta.ws.rs.POST;


@RegisterRestClient(baseUri = "https://api.groq.com/openai/v1/audio/transcriptions")
public interface TranscriptionService {
    
    @POST
    @ClientHeaderParam(name = "Authorization", value = "Bearer ${qroq.token}") 
    Transcript transcribeAudio(@RestForm File file, @RestForm String model);

}
