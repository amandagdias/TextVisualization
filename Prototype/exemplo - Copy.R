matriz <- matrix(0L, nrow= 21578, ncol = 5)
fileName <- "E:\\Documents\\USP\\Visualização computacional\\Projeto\\Exemplo\\svm.fil"
conn <- file(fileName,open="rt")
linn <-readLines(conn)
v <- c(0,0)
documents <- c()
topics <- matrix(nrow = 5, ncol = 2)

newTxt <- unlist(strsplit(linn[1], split = "\\s"))  ## split the string at the spaces
   
for (j in newTxt){			
	j <- unlist(strsplit(j, split = ":"))		

	if (!is.na(j[2])){	
		 v <- rbind(v,as.numeric(j)) 	    
	}
}
v <- v[order(v[,2]),]
test <- (nrow(v) - 5)	
topics <- v[-(1:test),]
print(topics)

lines <- 1
newLine <- 0
for (i in 1:length(linn)){
   newTxt <- unlist(strsplit(linn[i], split = "\\s"))  ## split the string at the spaces
   
   for (j in newTxt){			
	j <- unlist(strsplit(j, split = ":"))		

	if (!is.na(j[2])){	   	  		  
	    col <- as.numeric(j[1])
	    if (col %in% topics){
		  index <- match(col, topics)		
		  if (as.numeric(j[2]) > 0){		    
		    matriz[lines,index] = as.numeric(j[2])	
		    newLine = newLine + 1		    	    
              }	  
 	    	 
	    }
	}else{
   	    documentName <- j[1]
	}    		
   } 
   if (newLine >= 2){
	 documents <- rbind(documents, documentName)
  	 lines = lines + 1 
       newLine = 0
   }
  
}
print(documents[1:10])
print(matriz[1:10,])
lines = lines - 1
close(conn)
library("mp")
coord <- lsp(matriz[1:lines,])
#print(coord)
plot(coord)
pos_vector <- rep(3, length(documents))
text(coord[,1], coord[,2], labels=documents, cex= 0.7, pos=pos_vector)