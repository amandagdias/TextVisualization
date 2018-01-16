#Defining matriz that will hold the values of the svm.fil file
matriz <- matrix(0L, nrow= 42734, ncol = 21578)

#Openning file 
fileName <- "E:\\Google Drive\\Documents\\USP\\Visualização computacional\\Projeto\\Exemplo\\svm.fil"
conn <- file(fileName,open="rt")
linn <-readLines(conn)

#k = number of similar documents to the query document
k <- 500

#Defining m which will be the matrix only with the k documents and their terms
m <- matrix(nrow=42734, ncol = k)

#This vector will contain the names of the documents
documents <- c()

#Going through the svm.fil file and saving values to matriz
ncolumn <- 1
for (i in 1:length(linn)){
   newTxt <- unlist(strsplit(linn[i], split = "\\s"))  ## split the string at the spaces
   
   for (j in newTxt){			
	j <- unlist(strsplit(j, split = ":"))		

	if (!is.na(j[2])){
          #The rows are the topics and the columns are the documents 	   	  		  
	    line <- as.numeric(j[1])
	    matriz[line, ncolumn] = as.numeric(j[2])	
	}else{
   	    documents[ncolumn] = j[1]
	}    		
   } 
   ncolumn = ncolumn + 1   
}

close(conn)
ncolumn = ncolumn - 1
#The matrix exampleDocument will contain the terms frequency of the first document
#We are considering that the first document is our query document
exampleDocument <- matriz[,1:1]

#Define the matrix that will contain the cosine dissimilarity measure between the query document and the others
distanceExample <- matrix(0L, nrow= 21578, ncol = 2)
library("lsa")
for (i in 1:ncolumn){ 
    #Saves both cosine distance and index (will be necessary to recover the document later)     
    distanceExample[i,2] = cosine(matriz[,i],exampleDocument) 
    distanceExample[i,1] = i   
}

#Orders the distanceMatrix from the last similar to the most similar
distanceExample <- distanceExample[order(distanceExample[,2]),]

#Get the k most similar (from bottom to top)
index <- nrow(distanceExample) - k 
distanceExample <- distanceExample[-(1:index),]

#With the index that we saved, we can retrieve the documents' names
names <- c()
for (i in 1:k)
{
    names[i] = documents[distanceExample[i,1]]
    
}

#Saving the m matrix which will contain only the k most similar documents
#The indexes vector is used when saving the csv file needed by the front-end (barchart)
indexes <- c()
for (i in 1:k)
{   
   for (j in 1:nrow(matriz))
   {
      m[j,i] = matriz[j,(distanceExample[i,1])] 
	indexes[j] = j;
   }  

}

#Removing all the rows (terms) that does not appear in any of the k most similar documents
indexes<- indexes[rowSums(m[, -1] > 0) != 0]
m <- m[rowSums(m[, -1] > 0) != 0, ]

#The mindexes vector is used to create a header for the csv file
j <- 1
for (i in 1:ncol(m)){
   mindexes[j] = paste("V", distanceExample[i,1], sep="")	
   j = j + 1
}

#Defining the header for the m matrix
colnames(m)<-mindexes

#Combining the indexes (term id) with the corresponding documents' frequency
m2 <- cbind(indexes, m);

#Saving the csv file that will be used by the front-end (barchart)
write.csv(m2, file="E:\\Google Drive\\Documents\\USP\\Visualização computacional\\Projeto\\Exemplo\\D3\\files\\barchart500.csv") 

#This part is where we do the dimensionality reduction and save a file that will be used by the front end (scatterplot) with the coordinates
#Defining the cos matrix which will contain the cosine dissimilarity of the k most similar documents
cos <- matrix(nrow = k, ncol = k)
library("lsa")
cos = cosine(m)

#Use the lsp or tSNE technique using the dissimilarity matrix
library("mp")
#coord <- lsp(cos)
coord <- tSNE(cos)

#Plots the coordinates
plot(coord)

#Creates categories for the documents (will be encoded by color later)
color <- seq(500, 1, -1)

#color[1:300] = "Less similar" #verde mais claro
#color[301:490] = "Neutral" #verde médio
#color[491:k] = "Most Similar" #verde mais escuro

#Saves the csv file containing the coordinates, document's names color 
header <- c("V1", "V2")
colnames(coord)<-header
coord <- cbind(coord,names)
coord <- cbind(coord,color)
write.csv(coord, file="E:\\Google Drive\\Documents\\USP\\Visualização computacional\\Projeto\\Exemplo\\D3\\files\\scatterplot500color.csv")
