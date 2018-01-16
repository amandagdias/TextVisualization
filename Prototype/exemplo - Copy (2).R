memory.limit(85000)
matriz <- matrix(0L, nrow= 42734, ncol = 21578)
fileName <- "E:\\Google Drive\\Documents\\USP\\Visualização computacional\\Projeto\\Exemplo\\svm.fil"
conn <- file(fileName,open="rt")
linn <-readLines(conn)
v <- c(0,0)
documents <- c()
lines <- 1
newLine <- 0
for (i in 1:length(linn)){
   newTxt <- unlist(strsplit(linn[i], split = "\\s"))  ## split the string at the spaces
   
   for (j in newTxt){			
	j <- unlist(strsplit(j, split = ":"))		

	if (!is.na(j[2])){	   	  		  
	    col <- as.numeric(j[1])
	    matriz[col, lines] = as.numeric(j[2])	
	    
	    		    	    

	}else{
   	    documents[lines] = j[1]
	}    		
   } 
   lines = lines + 1   
}
#print(documents[1:10])
#print(matriz[1:10, 1:10])
cos <- matrix(nrow = 21578, ncol = 21578)
library("lsa")
cos = cosine(matriz[1:100,])
#print(cost)
close(conn)
library("mp")
coord <- lsp(cos)
#print(coord)
plot(coord)
pos_vector <- rep(3, length(documents))
text(coord[,1], coord[,2], labels=documents, cex= 0.7, pos=pos_vector)