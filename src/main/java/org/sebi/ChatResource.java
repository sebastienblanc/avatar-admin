package org.sebi;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.Duration;
import java.util.Collection;
import java.util.Map;

import org.eclipse.microprofile.reactive.messaging.Channel;
import org.eclipse.microprofile.rest.client.inject.RestClient;
import org.jboss.resteasy.reactive.server.multipart.FormValue;
import org.jboss.resteasy.reactive.server.multipart.MultipartFormDataInput;

import io.quarkus.logging.Log;
import io.quarkus.redis.datasource.RedisDataSource;
import io.quarkus.redis.datasource.pubsub.PubSubCommands;
import io.smallrye.mutiny.Multi;
import io.smallrye.mutiny.Uni;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;


@Path("/initChat")
public class ChatResource {

    @RestClient
    TranscriptionService transcriptionService;

    private PubSubCommands<Notification> pub;

    public ChatResource(RedisDataSource ds) {
        pub = ds.pubsub(Notification.class);
    }

    private record DiscussionFragment(String from, String to, String message) {}

    private record Bleep(String avatar, String message) {}

    @Channel("discussions")
    Multi<DiscussionFragment> discussions;

    @Channel("bleeps")
    Multi<Bleep> bleeps;

    @GET
    @Path("/stream")
    @Produces(MediaType.SERVER_SENT_EVENTS) 
    public Multi<DiscussionFragment> stream() throws InterruptedException{
        return   discussions.onItem().call(i ->
        // Delay the emission until the returned uni emits its item
        Uni.createFrom().nullItem().onItem().delayIt().by(Duration.ofMillis(5000))
    );
    }

    @GET
    @Path("/bleeps")
    @Produces(MediaType.SERVER_SENT_EVENTS) 
    public Multi<Bleep> bleeps() {
        return bleeps;
    }

    @GET
    @Path("{initiator}/{receiver}")
    @Produces(MediaType.TEXT_PLAIN)
    public void hello(@PathParam("initiator") String initiator, @PathParam("receiver") String receiver) {
        pub.publish(receiver, new Notification("Hi ! It's "+ initiator +" . How are you doing ? ", initiator));
    }
    @GET
    @Path("stop/{initiator}/{receiver}")
    @Produces(MediaType.TEXT_PLAIN)
    public void stop(@PathParam("initiator") String initiator, @PathParam("receiver") String receiver) {
        pub.publish(receiver, new Notification("[STOP]", initiator));
        pub.publish(initiator, new Notification("[STOP]", receiver));
    }
    private static final String UPLOAD_DIR = "uploads/";

    @POST
    @Path("/audio")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    public void uploadAudio(MultipartFormDataInput input){
       Map<String, Collection<FormValue>> map = input.getValues();
       Collection<FormValue> collection =  map.get("audio");
       collection.forEach(formValue -> {
          
         
           try {
            String fileName = formValue.getFileName();
            InputStream is = formValue.getFileItem().getInputStream();
               Files.createDirectories(Paths.get(UPLOAD_DIR));
               File file = new File(UPLOAD_DIR + fileName);
               try (InputStream inputStream = is;
                    FileOutputStream outputStream = new FileOutputStream(file)) {
                   byte[] buffer = new byte[1024];
                   int bytesRead;
                   while ((bytesRead = inputStream.read(buffer)) != -1) {
                       outputStream.write(buffer, 0, bytesRead);
                   }
               }
             String transcription =  transcriptionService.transcribeAudio(file, "whisper-large-v3").getText();
             Log.info("Transcription : "+transcription);
             pub.publish("bob", new Notification(transcription, "sebi"));
             pub.publish("alice", new Notification(transcription, "sebi"));
           } catch (IOException e) {
               e.printStackTrace();
           }
        }
       ); 
    }   
}
